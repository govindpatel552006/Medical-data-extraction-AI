import re

# ------------------------------------------------------------------
# Keyword-based detection (handles messy OCR text, condition phrases,
# and medicine names — not just numeric lab values)
# ------------------------------------------------------------------

CONDITION_KEYWORDS = {
    'high_sugar': {
        'phrases': ['high blood sugar', 'high sugar', 'diabetes', 'diabetic', 'hyperglycemia', 'blood glucose'],
        'medicines': ['metformin', 'glimepiride', 'empagliflozin', 'gliclazide', 'sitagliptin', 'insulin', 'dapagliflozin'],
        'numeric_pattern': r'(glucose|sugar|blood sugar)[^\d]{0,15}(1[5-9]\d|[2-9]\d{2})',
    },
    'low_hemoglobin': {
        'phrases': ['anemia', 'anaemic', 'low hemoglobin', 'low haemoglobin'],
        'medicines': ['ferrous sulphate', 'iron supplement', 'folic acid'],
        'numeric_pattern': r'(hemoglobin|hb)[^\d]{0,15}([0-9](\.\d)?)\s*g',
    },
    'high_cholesterol': {
        'phrases': ['high cholesterol', 'hyperlipidemia', 'high ldl'],
        'medicines': ['atorvastatin', 'rosuvastatin', 'simvastatin'],
        'numeric_pattern': r'(cholesterol|ldl)[^\d]{0,15}(2[0-9]\d|[3-9]\d{2})',
    },
    'high_bp': {
        'phrases': ['high blood pressure', 'hypertension', 'high bp'],
        'medicines': ['amlodipine', 'losartan', 'telmisartan', 'atenolol', 'ramipril'],
        'numeric_pattern': r'(blood pressure|bp)[^\d]{0,15}(1[4-9]\d/\d{2,3})',
    },
    'low_vitamin_d': {
        'phrases': ['vitamin d deficiency', 'low vitamin d'],
        'medicines': ['cholecalciferol', 'vitamin d3'],
        'numeric_pattern': r'(vitamin d)[^\d]{0,15}([0-9]|1[0-9])\s*ng',
    },
    'thyroid': {
        'phrases': ['hypothyroidism', 'thyroid', 'hyperthyroidism'],
        'medicines': ['levothyroxine', 'thyroxine'],
        'numeric_pattern': None,
    },
}

DIET_TEMPLATES = {
    'high_sugar': {
        'label': 'Low-Carb / Diabetic-Friendly Plan',
        'avoid': ['white rice', 'sugary drinks', 'refined flour', 'sweets'],
        'include': ['leafy greens', 'whole grains', 'lean protein', 'nuts'],
    },
    'low_hemoglobin': {
        'label': 'Iron-Rich Plan',
        'avoid': ['tea/coffee with meals', 'excess dairy with iron-rich meals'],
        'include': ['spinach', 'lentils', 'red meat/eggs', 'vitamin C fruits (for iron absorption)'],
    },
    'high_cholesterol': {
        'label': 'Heart-Healthy Low-Fat Plan',
        'avoid': ['fried food', 'red meat', 'butter/ghee excess', 'processed snacks'],
        'include': ['oats', 'fish', 'olive oil', 'fruits and vegetables'],
    },
    'high_bp': {
        'label': 'Low-Sodium Plan',
        'avoid': ['excess salt', 'packaged/processed food', 'pickles', 'papad'],
        'include': ['bananas', 'leafy greens', 'low-fat dairy', 'garlic'],
    },
    'low_vitamin_d': {
        'label': 'Vitamin D Boost Plan',
        'avoid': ['nothing specific — focus on adding sources'],
        'include': ['fatty fish', 'egg yolks', 'fortified milk', 'sunlight exposure 15-20 min/day'],
    },
    'thyroid': {
        'label': 'Thyroid-Support Plan',
        'avoid': ['excess soy', 'raw cruciferous vegetables in large amounts', 'processed food'],
        'include': ['iodine-rich foods', 'selenium sources (brazil nuts)', 'whole grains', 'fruits'],
    },
    'general': {
        'label': 'General Balanced Diet',
        'avoid': ['excess sugar', 'fried food', 'processed snacks'],
        'include': ['fruits', 'vegetables', 'whole grains', 'lean protein', 'plenty of water'],
    },
}

MEAL_STRUCTURE = ['Breakfast', 'Mid-Morning Snack', 'Lunch', 'Evening Snack', 'Dinner']


def detect_conditions(extracted_text):
    """
    Scans OCR text for condition phrases, medicine names, and numeric
    lab patterns. Much more forgiving of messy/garbled OCR output
    than pure numeric regex alone.
    """
    text_lower = extracted_text.lower()
    detected = []

    for condition, rules in CONDITION_KEYWORDS.items():
        matched = False

        # Check condition phrases (e.g. "high blood sugar", "diabetes")
        for phrase in rules['phrases']:
            if phrase in text_lower:
                matched = True
                break

        # Check medicine names (e.g. "metformin")
        if not matched:
            for medicine in rules['medicines']:
                if medicine in text_lower:
                    matched = True
                    break

        # Check numeric lab value pattern, if defined
        if not matched and rules['numeric_pattern']:
            if re.search(rules['numeric_pattern'], text_lower):
                matched = True

        if matched:
            detected.append(condition)

    if not detected:
        detected.append('general')

    return detected


def generate_7_day_plan(extracted_text):
    """
    Returns (detected_conditions, plan_data)
    """
    conditions = detect_conditions(extracted_text)

    all_avoid = []
    all_include = []
    labels = []

    for cond in conditions:
        template = DIET_TEMPLATES.get(cond, DIET_TEMPLATES['general'])
        labels.append(template['label'])
        all_avoid.extend(template['avoid'])
        all_include.extend(template['include'])

    all_avoid = list(dict.fromkeys(all_avoid))
    all_include = list(dict.fromkeys(all_include))

    plan_data = {
        'summary': {
            'plan_type': ' + '.join(labels),
            'foods_to_avoid': all_avoid,
            'foods_to_include': all_include,
        },
        'days': {}
    }

    for day_num in range(1, 8):
        day_key = f"Day {day_num}"
        plan_data['days'][day_key] = {
            meal: _suggest_meal(meal, all_include, day_num)
            for meal in MEAL_STRUCTURE
        }

    return conditions, plan_data


def _suggest_meal(meal_type, include_list, day_num):
    if not include_list:
        return "Balanced meal with fruits, vegetables, and protein"

    idx = (day_num + hash(meal_type)) % len(include_list)
    primary_ingredient = include_list[idx]

    return f"{meal_type} with focus on {primary_ingredient}"