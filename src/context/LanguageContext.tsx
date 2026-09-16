'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'bn' | 'hi' | 'te' | 'ta' | 'kn' | 'ml';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  native: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', native: 'English', flag: '🌐' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' },
];

const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    // Nav
    'nav.dashboard': 'Dashboard',
    'nav.farms': 'My Farms',
    'nav.disease': 'Disease AI',
    'nav.optimization': 'GA-PSO Optimizer',
    'nav.iot': 'IoT Telemetry',
    'nav.insurance': 'Parametric Insurance',
    'nav.apply_insurance': 'Apply for Insurance',
    'nav.policy_review': 'Underwriting Policies',
    'nav.payments': 'Bank Payouts',
    'nav.underwriting': 'Underwriting Desk',
    'nav.claims': 'Claims Desk',
    'nav.risk_map': 'IU Risk Map',
    'nav.switch_role': 'Switch Role',
    'nav.sign_in': 'Sign In',
    'nav.register': 'Register',
    'nav.visual_guide_active': 'Visual Navigation Active',

    // Farmer Hub
    'farmer.greeting': 'Namaskar, Subhash Biswas',
    'farmer.selected_farm': 'Selected Farm',
    'farmer.plot_name': 'Plot #204 (Baganchra, Nadia)',
    'farmer.crop_health': 'Crop Health',
    'farmer.crop_health_status': 'OPTIMAL VIGOUR (0.71)',
    'farmer.crop_health_desc': 'Normal is 0.76 (93% of normal vigour)',
    'farmer.soil_moisture': 'Soil Moisture',
    'farmer.soil_moisture_desc': 'Adequate root zone volumetric content (58%)',
    'farmer.weather_risk': 'Weather Risk',
    'farmer.weather_risk_desc': 'Low risk; steady monsoon inflow',
    'farmer.disease_risk': 'Disease Risk',
    'farmer.disease_risk_desc': 'Canopy clear; zero blight detected',
    'farmer.next_action': 'Recommended Action',
    'farmer.next_action_desc': 'Micro-drip pulse or foliar spray on Friday',
    'farmer.actuate_pump': 'Actuate 45-Min Drip Cycle',
    'farmer.halt_pump': 'Halt Micro-Irrigation Pump',
    'farmer.pump_running': 'PUMP RUNNING',
    'farmer.pump_idle': 'STANDBY / IDLE',

    // Visual Guides (Low-literacy / Illiterate Support)
    'guide.title': 'Visual Picture Guide',
    'guide.subtitle': 'Follow the colored arrows step-by-step or listen to audio',
    'guide.step1': 'Step 1: Check your Green Plant Health Score 🟢',
    'guide.step2': 'Step 2: Check Blue Water Moisture Level 💧',
    'guide.step3': 'Step 3: Press Green Button to Start Water Pump ⚡',
    'guide.step4': 'Step 4: Check Shield for Insurance Protection 🛡️',
    'guide.audio_prompt': '🔊 Tap here to listen to today’s field advice',
    'guide.audio_speaking': '🔊 Playing voice advisory in your language...',
    'guide.arrow_next': 'Follow the Arrow to Next Action ➡️',
    'guide.arrow_down': 'Look Below ⬇️',

    // Insurance Application & Policy
    'ins.title': 'Parametric Crop Insurance',
    'ins.active_policy': 'Active Parametric Coverage',
    'ins.coverage_value': 'Coverage Sum Insured',
    'ins.trigger_condition': 'Trigger Condition',
    'ins.zero_breaches': 'Normal Vigilance (No Loss Breaches)',
    'ins.apply_title': 'Apply for Parametric Crop Insurance',
    'ins.apply_subtitle': 'Zero-paperwork index protection backed by satellite remote sensing & direct bank DBT payout.',
    'ins.select_plot': 'Step 1: Select Farm Plot',
    'ins.select_plan': 'Step 2: Choose Coverage Shield',
    'ins.premium_calc': 'Step 3: Subsidy & Premium Calculation',
    'ins.bank_verify': 'Step 4: Direct Benefit Bank Verification',
    'ins.submit_app': 'Submit Insurance Application ➡️',
    'ins.submitting': 'Submitting Application...',
    'ins.status_pending': 'Pending Underwriter Review',
    'ins.status_approved': 'Policy Approved & Active',
    'ins.status_rejected': 'Application Rejected',
    'ins.sum_insured': 'Sum Insured',
    'ins.gross_premium': 'Gross Premium',
    'ins.govt_subsidy': 'Govt PMFBY Subsidy (80%)',
    'ins.farmer_pays': 'Farmer Net Payable (2%)',
    'ins.view_policies': 'View All Policies',
    'ins.apply_new': 'Apply for New Insurance Policy ➡️',

    // Common & Actions
    'common.accept': 'Accept & Issue Policy',
    'common.reject': 'Reject Application',
    'common.status': 'Status',
    'common.view': 'View',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.reason': 'Reason',
    'common.notes': 'Underwriter Notes',

    // Extended Hero & Guidance Keys
    'nav.overview': 'Overview',
    'nav.workflow': 'Workflow',
    'nav.architecture': 'Architecture',
    'guide.step_health': 'Plant Health',
    'guide.step_moisture': 'Soil Moisture',
    'guide.step_pump': 'Water Pump',
    'guide.step_insurance': 'Crop Insurance',
    'guide.listen': '🔊 Listen',
    'guide.listening': 'Speaking...',
    'guide.listen_short': 'Voice',
    'guide.apply_btn': '🛡️ Apply Insurance',
    'hero.badge': 'Sentinel-2 MSI × IoT Telemetry × Parametric FinTech',
    'hero.title_start': 'Turn Crop Risk Into Action',
    'hero.title_gradient': 'Before It Becomes Crop Loss.',
    'hero.description': 'Autonomous agricultural resilience combining satellite multispectral passes, real-time in-situ IoT telemetry, entropy-weighted crop health estimation, and cryptographic parametric underwriting.',
    'hero.cta_farmer': 'Launch Farmer Hub',
    'hero.cta_workflow': '6-Stage Workflow',
    'hero.cta_insurer': 'Underwriting Desk',
    'hero.philosophy': '“Insurance backs up the yield-preservation system when unavoidable natural shocks exceed mitigation capability. It is the safety net, not the first line of defense.”',
    'hero.runtime_title': 'CLOSED-LOOP SYSTEM RUNTIME',
    'hero.runtime_pilot': 'Primary Pilot: Plot #204 (Rajesh Mondal, Nadia District) • Kharif Season',
    'hero.card1_title': '1. Satellite',
    'hero.card1_desc': 'Sentinel-2 MSI (10m) & Sentinel-1 SAR dual-pol passes',
    'hero.card2_title': '2. Field IoT',
    'hero.card2_desc': 'ESP32 3s root moisture, ambient DHT22 & NPK probes',
    'hero.card3_title': '3. Agronomic AI',
    'hero.card3_desc': 'GA-PSO nutrient balance & 38-class leaf computer vision',
    'hero.card4_title': '4. Intervention',
    'hero.card4_desc': 'Autonomous pump relays & targeted organic fertigation',
    'hero.card5_title': '5. Protection',
    'hero.card5_desc': 'Threshold breach triggers instant direct-to-bank payout',
  },

  bn: {
    // Nav
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.farms': 'আমার জমি',
    'nav.disease': 'রোগ নির্ণয় এআই',
    'nav.optimization': 'সার ও জল',
    'nav.iot': 'আইওটি পাম্প',
    'nav.insurance': 'প্যারামেট্রিক ফসল বীমা',
    'nav.apply_insurance': 'বীমার জন্য আবেদন',
    'nav.policy_review': 'বীমা পলিসি অনুমোদন',
    'nav.payments': 'ব্যাংক ক্ষতিপূরণ',
    'nav.underwriting': 'বীমা ডেস্ক',
    'nav.claims': 'দাবি কেন্দ্র',
    'nav.risk_map': 'ঝুঁকি মানচিত্র',
    'nav.switch_role': 'রোল পরিবর্তন',
    'nav.sign_in': 'লগইন',
    'nav.register': 'নতুন নিবন্ধন',
    'nav.visual_guide_active': 'সহজ নির্দেশিকা',

    // Farmer Hub
    'farmer.greeting': 'নমস্কার, সুভাষ বিশ্বাস',
    'farmer.selected_farm': 'নির্বাচিত জমি',
    'farmer.plot_name': 'প্লট ২০৪ (বাগানআঁচড়া, নদিয়া)',
    'farmer.crop_health': 'ফসলের স্বাস্থ্য',
    'farmer.crop_health_status': 'খুব ভালো অবস্থা (০.৭১)',
    'farmer.crop_health_desc': 'স্বাভাবিক মাপকাঠি ০.৭৬ (৯৩% সতেজ)',
    'farmer.soil_moisture': 'মাটির আর্দ্রতা / রস',
    'farmer.soil_moisture_desc': 'শিকড়ে পর্যাপ্ত রস আছে (৫৮%)',
    'farmer.weather_risk': 'আবহাওয়া ঝুঁকি',
    'farmer.weather_risk_desc': 'কম ঝুঁকি; স্বাভাবিক বৃষ্টিপাতের পূর্বাভাস',
    'farmer.disease_risk': 'রোগ বা পোকার ভয়',
    'farmer.disease_risk_desc': 'গাছ পরিষ্কার; কোনো ধসা বা দাগ নেই',
    'farmer.next_action': 'আজকের করণীয় পরামর্শ',
    'farmer.next_action_desc': 'শুক্রবার হালকা জলসেচ অথবা পাতার স্প্রে করুন',
    'farmer.actuate_pump': '৪৫ মিনিটের জলসেচ পাম্প চালু করুন',
    'farmer.halt_pump': 'জলসেচ পাম্প বন্ধ করুন',
    'farmer.pump_running': 'পাম্প চলছে 💧',
    'farmer.pump_idle': 'পাম্প বন্ধ আছে',

    // Visual Guides (Low-literacy / Illiterate Support)
    'guide.title': 'সহজ চিত্র নির্দেশিকা',
    'guide.subtitle': 'রঙিন তীরের দিক দেখুন অথবা বাংলায় ভয়েস পরামর্শ শুনুন',
    'guide.step1': 'ধাপ ১: সবুজ রঙের ফসলের স্বাস্থ্য দেখুন 🟢',
    'guide.step2': 'ধাপ ২: নীল রঙের মাটির জলের রস পরীক্ষা করুন 💧',
    'guide.step3': 'ধাপ ৩: জলসেচ দিতে সবুজ বোতামটি টিপুন ⚡',
    'guide.step4': 'ধাপ ৪: ফসলের বীমা সুরক্ষা চালু আছে কিনা দেখুন 🛡️',
    'guide.audio_prompt': '🔊 আজকের কৃষি পরামর্শ বাংলায় শুনতে এখানে টিপুন',
    'guide.audio_speaking': '🔊 বাংলায় ভয়েস পরামর্শ বাজানো হচ্ছে...',
    'guide.arrow_next': 'পরবর্তী কাজের জন্য তীরের দিক অনুসরণ করুন ➡️',
    'guide.arrow_down': 'নিচে দেখুন ⬇️',

    // Insurance Application & Policy
    'ins.title': 'প্যারামেট্রিক ফসল বীমা সুরক্ষা',
    'ins.active_policy': 'সক্রিয় ফসল বীমা পলিসি',
    'ins.coverage_value': 'মোট বীমার মূল্য',
    'ins.trigger_condition': 'ক্ষতিপূরণের শর্ত',
    'ins.zero_breaches': 'কোনো প্রাকৃতিক দুর্যোগ নেই (সুরক্ষিত)',
    'ins.apply_title': 'নতুন প্যারামেট্রিক ফসল বীমার আবেদন',
    'ins.apply_subtitle': 'কোনো কাগজের ঝামেলা ছাড়াই স্যাটেলাইট ভিত্তিক স্বয়ংক্রিয় ব্যাংক ক্ষতিপূরণ বীমা।',
    'ins.select_plot': 'ধাপ ১: ফসলের জমি নির্বাচন করুন',
    'ins.select_plan': 'ধাপ ২: বীমা সুরক্ষার ধরন বেছে নিন',
    'ins.premium_calc': 'ধাপ ৩: সরকারি ভর্তুকি ও প্রিমিয়াম হিসাব',
    'ins.bank_verify': 'ধাপ ৪: সরাসরি ব্যাংক অ্যাকাউন্ট যাচাই',
    'ins.submit_app': 'বীমার আবেদন জমা দিন ➡️',
    'ins.submitting': 'আবেদন জমা নেওয়া হচ্ছে...',
    'ins.status_pending': 'বীমা কোম্পানির অনুমোদনের অপেক্ষায়',
    'ins.status_approved': 'বীমা অনুমোদিত ও সক্রিয়',
    'ins.status_rejected': 'আবেদন গৃহীত হয়নি',
    'ins.sum_insured': 'মোট বীমার টাকা',
    'ins.gross_premium': 'মোট প্রিমিয়াম',
    'ins.govt_subsidy': 'সরকারি ভর্তুকি (৮০%)',
    'ins.farmer_pays': 'কৃষকের দেয় টাকা (মাত্র ২%)',
    'ins.view_policies': 'সকল বীমা পলিসি দেখুন',
    'ins.apply_new': 'নতুন ফসল বীমার আবেদন করুন ➡️',

    // Common & Actions
    'common.accept': 'অনুমোদন ও পলিসি প্রদান',
    'common.reject': 'আবেদন বাতিল করুন',
    'common.status': 'অবস্থা',
    'common.view': 'দেখুন',
    'common.cancel': 'বাতিল',
    'common.confirm': 'নিশ্চিত করুন',
    'common.reason': 'বাতিলের কারণ',
    'common.notes': 'বীমা কর্মকর্তার মন্তব্য',

    // Extended Hero & Guidance Keys
    'nav.overview': 'ভূমিকা',
    'nav.workflow': '৬-ধাপের পদ্ধতি',
    'nav.architecture': 'স্থাপত্য',
    'guide.step_health': 'ফসলের স্বাস্থ্য',
    'guide.step_moisture': 'মাটির রস',
    'guide.step_pump': 'জলের পাম্প',
    'guide.step_insurance': 'ফসল বীমা',
    'guide.listen': '🔊 শুনুন',
    'guide.listening': 'শুনছেন...',
    'guide.listen_short': 'ভয়েস',
    'guide.apply_btn': '🛡️ বীমা আবেদন',
    'hero.badge': 'সেন্টিনেল-২ স্যাটেলাইট × আইওটি সেন্সর × প্যারামেট্রিক বীমা',
    'hero.title_start': 'ফসলের ঝুঁকিকে পদক্ষেপে রূপান্তর করুন',
    'hero.title_gradient': 'ক্ষতি হওয়ার আগেই প্রতিরোধ করুন।',
    'hero.description': 'স্যাটেলাইট রিমোট সেন্সিং, জমিতে বসানো আইওটি সেন্সর, এআই ফসল স্বাস্থ্য মূল্যায়ন এবং সরাসরি ব্যাংক অ্যাকাউন্টে স্বয়ংক্রিয় ক্ষতিপূরণ।',
    'hero.cta_farmer': 'কৃষক হাব খুলুন',
    'hero.cta_workflow': '৬-ধাপের কর্মপদ্ধতি',
    'hero.cta_insurer': 'বীমা আন্ডাররাইটিং ডেস্ক',
    'hero.philosophy': '“অনিবার্য প্রাকৃতিক দুর্যোগ প্রতিরোধের অতীত হলে ফসল বীমা কৃষকের আর্থিক ক্ষতি রক্ষা করে। এটি চরম বিপদের নিরাপত্তা বলয়, প্রথম পদক্ষেপ নয়।”',
    'hero.runtime_title': 'ক্লোজড-লুপ সিস্টেম রানটাইম',
    'hero.runtime_pilot': 'প্রধান পাইলট: প্লট #২০৪ (রাজেশ মণ্ডল, নদিয়া জেলা) • খরিফ মৌসুম',
    'hero.card1_title': '১. স্যাটেলাইট',
    'hero.card1_desc': 'সেন্টিনেল-২ এবং সেন্টিনেল-১ রাডার তথ্য',
    'hero.card2_title': '২. ফিল্ড আইওটি',
    'hero.card2_desc': 'মাটির রস, তাপমাত্রা ও এনপিকে সেন্সর তথ্য',
    'hero.card3_title': '৩. এগ্রোনমিক এআই',
    'hero.card3_desc': 'সার ও পুষ্টি অপ্টিমাইজেশন এবং রোগ নির্ণয়',
    'hero.card4_title': '৪. পদক্ষেপ',
    'hero.card4_desc': 'স্বয়ংক্রিয় জলসেচ পাম্প চালু ও নিয়ন্ত্রিত সার প্রয়োগ',
    'hero.card5_title': '৫. বীমা সুরক্ষা',
    'hero.card5_desc': 'দুর্যোগের তীব্রতায় সরাসরি ব্যাংক অ্যাকাউন্টে ক্ষতিপূরণ',
  },

  hi: {
    // Nav
    'nav.dashboard': 'डैशबोर्ड',
    'nav.farms': 'मेरे खेत',
    'nav.disease': 'रोग पहचान एआई',
    'nav.optimization': 'खाद व सिंचाई',
    'nav.iot': 'पंप नियंत्रण',
    'nav.insurance': 'पैरामीट्रिक फसल बीमा',
    'nav.apply_insurance': 'बीमा आवेदन',
    'nav.policy_review': 'पॉलिसी समीक्षा',
    'nav.payments': 'बैंक भुगतान',
    'nav.underwriting': 'अंडरराइटिंग',
    'nav.claims': 'दावा केंद्र',
    'nav.risk_map': 'जोखिम मानचित्र',
    'nav.switch_role': 'भूमिका बदलें',
    'nav.sign_in': 'लॉग इन',
    'nav.register': 'नया पंजीकरण',
    'nav.visual_guide_active': 'दृश्य मार्गदर्शन',

    // Farmer Hub
    'farmer.greeting': 'नमस्ते, सुभाष बिस्वास',
    'farmer.selected_farm': 'चुना गया खेत',
    'farmer.plot_name': 'खेत #204 (बागानआंचड़ा, नदिया)',
    'farmer.crop_health': 'फसल का स्वास्थ्य',
    'farmer.crop_health_status': 'उत्कृष्ट स्थिति (0.71)',
    'farmer.crop_health_desc': 'सामान्य स्तर 0.76 (93% स्वस्थ फसल)',
    'farmer.soil_moisture': 'मिट्टी में नमी',
    'farmer.soil_moisture_desc': 'जड़ में पर्याप्त नमी उपलब्ध है (58%)',
    'farmer.weather_risk': 'मौसम का जोखिम',
    'farmer.weather_risk_desc': 'कम जोखिम; सामान्य वर्षा का अनुमान',
    'farmer.disease_risk': 'कीट व रोग का जोखिम',
    'farmer.disease_risk_desc': 'फसल बिल्कुल साफ है; कोई झुलसा नहीं',
    'farmer.next_action': 'आज का कृषि सुझाव',
    'farmer.next_action_desc': 'शुक्रवार को ड्रिप सिंचाई या पर्णीय छिड़काव करें',
    'farmer.actuate_pump': '45 मिनट का सिंचाई पंप चालू करें',
    'farmer.halt_pump': 'सिंचाई पंप बंद करें',
    'farmer.pump_running': 'पंप चालू है 💧',
    'farmer.pump_idle': 'पंप बंद है',

    // Visual Guides
    'guide.title': 'सरल चित्र गाइड',
    'guide.subtitle': 'तीर के निशानों का पालन करें या बोलकर सुनें',
    'guide.step1': 'चरण 1: हरे रंग का फसल स्वास्थ्य स्कोर देखें 🟢',
    'guide.step2': 'चरण 2: नीले रंग की मिट्टी की नमी जाँचें 💧',
    'guide.step3': 'चरण 3: पानी देने के लिए हरा बटन दबाएं ⚡',
    'guide.step4': 'चरण 4: फसल बीमा सुरक्षा कवच देखें 🛡️',
    'guide.audio_prompt': '🔊 आज की कृषि सलाह सुनने के लिए यहाँ दबाएं',
    'guide.audio_speaking': '🔊 हिंदी में वॉयस सलाह सुनाई जा रही है...',
    'guide.arrow_next': 'अगले कदम के लिए तीर के निशान का पालन करें ➡️',
    'guide.arrow_down': 'नीचे देखें ⬇️',

    // Insurance
    'ins.title': 'पैरामीट्रिक फसल बीमा सुरक्षा',
    'ins.active_policy': 'सक्रिय पैरामीट्रिक बीमा सुरक्षा',
    'ins.coverage_value': 'कुल बीमा राशि',
    'ins.trigger_condition': 'मुआवजा मिलने की शर्त',
    'ins.zero_breaches': 'फसल पूरी तरह सुरक्षित है',
    'ins.apply_title': 'पैरामीट्रिक फसल बीमा हेतु आवेदन',
    'ins.apply_subtitle': 'उपग्रह द्वारा स्वचालित सत्यापन व सीधा बैंक खाते में मुआवजा।',
    'ins.select_plot': 'चरण 1: अपना खेत चुनें',
    'ins.select_plan': 'चरण 2: बीमा सुरक्षा कवच चुनें',
    'ins.premium_calc': 'चरण 3: सरकारी सब्सिडी व प्रीमियम गणना',
    'ins.bank_verify': 'चरण 4: बैंक खाता सत्यापन',
    'ins.submit_app': 'बीमा आवेदन जमा करें ➡️',
    'ins.submitting': 'आवेदन जमा किया जा रहा है...',
    'ins.status_pending': 'समीक्षाधीन (बीमा कंपनी के पास)',
    'ins.status_approved': 'बीमा स्वीकृत एवं चालू',
    'ins.status_rejected': 'आवेदन अस्वीकृत',
    'ins.sum_insured': 'कुल बीमा धन',
    'ins.gross_premium': 'कुल प्रीमियम',
    'ins.govt_subsidy': 'सरकारी सब्सिडी (80%)',
    'ins.farmer_pays': 'किसान का हिस्सा (केवल 2%)',
    'ins.view_policies': 'सभी बीमा पॉलिसियाँ देखें',
    'ins.apply_new': 'नई बीमा पॉलिसी के लिए आवेदन करें ➡️',

    // Common
    'common.accept': 'स्वीकृत करें एवं पॉलिसी जारी करें',
    'common.reject': 'आवेदन अस्वीकार करें',
    'common.status': 'स्थिति',
    'common.view': 'देखें',
    'common.cancel': 'रद्द करें',
    'common.confirm': 'पुष्टि करें',
    'common.reason': 'अस्वीकृति का कारण',
    'common.notes': 'अंडरराइटर टिप्पणी',

    // Extended Hero & Guidance Keys
    'nav.overview': 'अवलोकन',
    'nav.workflow': '6-चरणीय प्रक्रिया',
    'nav.architecture': 'आर्किटेक्चर',
    'guide.step_health': 'फसल स्वास्थ्य',
    'guide.step_moisture': 'मिट्टी की नमी',
    'guide.step_pump': 'पानी का पंप',
    'guide.step_insurance': 'फसल बीमा',
    'guide.listen': '🔊 सुनें',
    'guide.listening': 'सुनाई दे रहा है...',
    'guide.listen_short': 'आवाज',
    'guide.apply_btn': '🛡️ बीमा आवेदन',
    'hero.badge': 'सेंटिनल-2 उपग्रह × IoT टेलीमेट्री × पैरामेट्रिक बीमा',
    'hero.title_start': 'फसल के जोखिम को नुकसान से पहले',
    'hero.title_gradient': 'सुरक्षा और समाधान में बदलें।',
    'hero.description': 'उपग्रह रिमोट सेंसिंग, खेत में लगे IoT सेंसर, AI फसल स्वास्थ्य विश्लेषण और सीधे बैंक खाते में स्वचालित बीमा भुगतान।',
    'hero.cta_farmer': 'किसान हब खोलें',
    'hero.cta_workflow': '6-चरणीय कार्यप्रणाली',
    'hero.cta_insurer': 'बीमा अंडरराइटिंग डेस्क',
    'hero.philosophy': '“जब अपरिहार्य प्राकृतिक आपदाएं रोकथाम की क्षमता से अधिक हो जाती हैं, तो बीमा सुरक्षा प्रदान करता है। यह सुरक्षा कवच है।”',
    'hero.runtime_title': 'क्लोज्ड-लूप सिस्टम रनटाइम',
    'hero.runtime_pilot': 'मुख्य पायलट: खेत #204 (राजेश मंडल, नदिया जिला) • खरीफ सीजन',
    'hero.card1_title': '1. उपग्रह',
    'hero.card1_desc': 'सेंटिनल-2 और सेंटिनल-1 रडार अवलोकन',
    'hero.card2_title': '2. फील्ड IoT',
    'hero.card2_desc': 'मिट्टी की नमी, तापमान और NPK सेंसर डेटा',
    'hero.card3_title': '3. कृषि AI',
    'hero.card3_desc': 'पोषक तत्व संतुलन और फसल रोग की सटीक पहचान',
    'hero.card4_title': '4. त्वरित कार्रवाई',
    'hero.card4_desc': 'स्वचालित सिंचाई पंप और सटीक पोषक छिड़काव',
    'hero.card5_title': '5. बीमा सुरक्षा',
    'hero.card5_desc': 'आपदा आने पर सीधे बैंक खाते में तत्काल बीमा भुगतान',
  },

  te: {
    // Nav
    'nav.dashboard': 'డ్యాష్‌బోర్డ్',
    'nav.farms': 'నా పొలాలు',
    'nav.disease': 'తెగుళ్ల AI',
    'nav.optimization': 'ఎరువులు & నీరు',
    'nav.iot': 'IoT పంపులు',
    'nav.insurance': 'పంట బీమా',
    'nav.apply_insurance': 'బీమా దరఖాస్తు',
    'nav.policy_review': 'పాలసీ సమీక్ష',
    'nav.payments': 'బ్యాంక్ చెల్లింపులు',
    'nav.underwriting': 'అండర్‌రైటింగ్',
    'nav.claims': 'క్లెయిమ్‌లు',
    'nav.risk_map': 'ప్రమాద పటం',
    'nav.switch_role': 'పాత్ర మార్చండి',
    'nav.sign_in': 'లాగిన్',
    'nav.register': 'కొత్త నమోదు',
    'nav.visual_guide_active': 'దృశ్య మార్గదర్శకత్వం',

    // Farmer Hub
    'farmer.greeting': 'నమస్కారం, సుభాష్ బిస్వాస్',
    'farmer.selected_farm': 'ఎంచుకున్న పొలం',
    'farmer.plot_name': 'పొలం #204 (నదియా)',
    'farmer.crop_health': 'పంట ఆరోగ్యం',
    'farmer.crop_health_status': 'అద్భుతమైన స్థితి (0.71)',
    'farmer.crop_health_desc': 'సాధారణ స్థాయి 0.76 (93% ఆరోగ్యకరమైనది)',
    'farmer.soil_moisture': 'నేల తేమ',
    'farmer.soil_moisture_desc': 'వేర్లకు తగినంత తేమ ఉంది (58%)',
    'farmer.weather_risk': 'వాతావరణ ప్రమాదం',
    'farmer.weather_risk_desc': 'తక్కువ ప్రమాదం; సాధారణ వర్ష సూచన',
    'farmer.disease_risk': 'తెగుళ్ల ప్రమాదం',
    'farmer.disease_risk_desc': 'పంట పరిశుభ్రంగా ఉంది',
    'farmer.next_action': 'నేటి వ్యవసాయ సలహా',
    'farmer.next_action_desc': 'శుక్రవారం నాడు బిందు సేద్యం చేయండి',
    'farmer.actuate_pump': '45 నిమిషాల పంపు ప్రారంభించండి',
    'farmer.halt_pump': 'పంపును ఆపివేయండి',
    'farmer.pump_running': 'పంపు నడుస్తోంది 💧',
    'farmer.pump_idle': 'పంపు ఆగిపోయింది',

    // Visual Guides
    'guide.title': 'దృశ్య చిత్ర మార్గదర్శి',
    'guide.subtitle': 'బాణాల గుర్తులను అనుసరించండి లేదా వాయిస్ సలహా వినండి',
    'guide.step1': 'దశ 1: ఆకుపచ్చ పంట ఆరోగ్యం చూడండి 🟢',
    'guide.step2': 'దశ 2: నేలలో నీటి తేమను తనిఖీ చేయండి 💧',
    'guide.step3': 'దశ 3: పంపు ప్రారంభించడానికి ఆకుపచ్చ బటన్ నొక్కండి ⚡',
    'guide.step4': 'దశ 4: మీ పంట బీమా రక్షణ చూడండి 🛡️',
    'guide.audio_prompt': '🔊 నేటి వ్యవసాయ సలహాలను వినడానికి ఇక్కడ నొక్కండి',
    'guide.audio_speaking': '🔊 తెలుగులో వాయిస్ సలహా వినిపిస్తోంది...',
    'guide.arrow_next': 'తదుపరి చర్య కోసం బాణాన్ని అనుసరించండి ➡️',
    'guide.arrow_down': 'క్రింద చూడండి ⬇️',

    // Insurance
    'ins.title': 'పారామెట్రిక్ పంట బీమా రక్షణ',
    'ins.active_policy': 'క్రియాశీల పంట బీమా పాలసీ',
    'ins.coverage_value': 'మొత్తం బీమా మొత్తం',
    'ins.trigger_condition': 'పరిహార నిబంధన',
    'ins.zero_breaches': 'పంట పూర్తిగా సురక్షితం',
    'ins.apply_title': 'పారామెట్రిక్ పంట బీమా దరఖాస్తు',
    'ins.apply_subtitle': 'కాగిత రహిత ఆటోమేటిక్ బ్యాంక్ పరిహారం.',
    'ins.select_plot': 'దశ 1: మీ పొలాన్ని ఎంచుకోండి',
    'ins.select_plan': 'దశ 2: బీమా రక్షణను ఎంచుకోండి',
    'ins.premium_calc': 'దశ 3: ప్రభుత్వ సబ్సిడీ మరియు ప్రీమియం లెక్కింపు',
    'ins.bank_verify': 'దశ 4: బ్యాంక్ ఖాతా ధృవీకరణ',
    'ins.submit_app': 'దరఖాస్తు సమర్పించండి ➡️',
    'ins.submitting': 'సమర్పిస్తోంది...',
    'ins.status_pending': 'పరిశీలనలో ఉంది',
    'ins.status_approved': 'బీమా ఆమోదించబడింది',
    'ins.status_rejected': 'దరఖాస్తు తిరస్కరించబడింది',
    'ins.sum_insured': 'బీమా మొత్తం',
    'ins.gross_premium': 'మొత్తం ప్రీమియం',
    'ins.govt_subsidy': 'ప్రభుత్వ సబ్సిడీ (80%)',
    'ins.farmer_pays': 'రైతు వాటా (కేవలం 2%)',
    'ins.view_policies': 'అన్ని పాలసీలను చూడండి',
    'ins.apply_new': 'కొత్త బీమా కోసం దరఖాస్తు చేసుకోండి ➡️',

    // Common
    'common.accept': 'ఆమోదించి పాలసీ జారీ చేయండి',
    'common.reject': 'దరఖాస్తును తిరస్కరించండి',
    'common.status': 'స్థితి',
    'common.view': 'చూడండి',
    'common.cancel': 'రద్దు చేయండి',
    'common.confirm': 'నిర్ధారించండి',
    'common.reason': 'తిరస్కరణ కారణం',
    'common.notes': 'అండర్‌రైటర్ గమనికలు',

    // Extended Hero & Guidance Keys
    'nav.overview': 'అవలోకనం',
    'nav.workflow': '6 దశల విధానం',
    'nav.architecture': 'ఆర్కిటెక్చర్',
    'guide.step_health': 'పంట ఆరోగ్యం',
    'guide.step_moisture': 'నేల తేమ',
    'guide.step_pump': 'నీటి పంపు',
    'guide.step_insurance': 'పంట బీమా',
    'guide.listen': '🔊 వినండి',
    'guide.listening': 'వినిపిస్తోంది...',
    'guide.listen_short': 'వాయిస్',
    'guide.apply_btn': '🛡️ బీమా దరఖాస్తు',
    'hero.badge': 'సెంటినెల్-2 ఉపగ్రహం × IoT సెన్సార్లు × పారామెట్రిక్ బీమా',
    'hero.title_start': 'పంట నష్టాన్ని ముందే గుర్తించండి',
    'hero.title_gradient': 'నష్టం జరగకముందే రక్షించుకోండి.',
    'hero.description': 'ఉపగ్రహ చిత్రాలు, పొలంలోని IoT సెన్సార్లు, AI పంట ఆరోగ్య విశ్లేషణ మరియు ఆటోమేటిక్ బ్యాంక్ పరిహారంతో రైతుల పంటలకు పూర్తి భద్రత.',
    'hero.cta_farmer': 'రైతు కేంద్రం తెరవండి',
    'hero.cta_workflow': '6 దశల విధానం',
    'hero.cta_insurer': 'బీమా అండర్‌రైటింగ్ డెస్క్',
    'hero.philosophy': '“అనివార్యమైన ప్రకృతి వైపరీత్యాలు సంభవించినప్పుడు రైతుకు ఆర్థిక నష్టం కలగకుండా పంట బీమా రక్షణ కల్పిస్తుంది. ఇది భద్రతా వలయం, మొదటి రక్షణ వరుస కాదు.”',
    'hero.runtime_title': 'క్లోజ్డ్-లూప్ సిస్టమ్ రన్‌టైమ్',
    'hero.runtime_pilot': 'ప్రధాన పైలట్: పొలం #204 (రాజేష్ మొండల్, నదియా జిల్లా) • ఖరీఫ్ సీజన్',
    'hero.card1_title': '1. ఉపగ్రహం',
    'hero.card1_desc': 'సెంటినెల్-2 మరియు సెంటినెల్-1 రాడార్ పరిశీలన',
    'hero.card2_title': '2. పొలం IoT',
    'hero.card2_desc': 'నేల తేమ, ఉష్ణోగ్రత మరియు NPK సెన్సార్ సమాచారం',
    'hero.card3_title': '3. వ్యవసాయ AI',
    'hero.card3_desc': 'ఎరువుల సమతుల్యత మరియు పంట తెగుళ్ల గుర్తింపు',
    'hero.card4_title': '4. సత్వర చర్య',
    'hero.card4_desc': 'ఆటోమేటిక్ నీటి పంపు మరియు బిందు సేద్యం',
    'hero.card5_title': '5. బీమా రక్షణ',
    'hero.card5_desc': 'విపత్తు సంభవించిన వెంటనే బ్యాంక్ ఖాతాకు నేరుగా పరిహారం',
  },

  ta: {
    // Nav
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.farms': 'எனது பண்ணைகள்',
    'nav.disease': 'பயிர் நோய் AI',
    'nav.optimization': 'உர திட்டமிடல்',
    'nav.iot': 'பம்ப் கட்டுப்பாடு',
    'nav.insurance': 'பயிர் காப்பீடு',
    'nav.apply_insurance': 'காப்பீடு விண்ணப்பம்',
    'nav.policy_review': 'மதிப்பாய்வு',
    'nav.payments': 'வங்கி இழப்பீடு',
    'nav.underwriting': 'காப்பீட்டு மேசை',
    'nav.claims': 'கோரிக்கைகள்',
    'nav.risk_map': 'இடர் வரைபடம்',
    'nav.switch_role': 'பங்கை மாற்றவும்',
    'nav.sign_in': 'உள்நுழைக',
    'nav.register': 'பதிவு செய்யவும்',
    'nav.visual_guide_active': 'காட்சி வழிகாட்டி',

    // Farmer Hub
    'farmer.greeting': 'வணக்கம், சுபாஷ் பிஸ்வாஸ்',
    'farmer.selected_farm': 'தேர்ந்தெடுக்கப்பட்ட பண்ணை',
    'farmer.plot_name': 'பண்ணை #204 (நதியா)',
    'farmer.crop_health': 'பயிர் ஆரோக்கியம்',
    'farmer.crop_health_status': 'சிறந்த நிலை (0.71)',
    'farmer.crop_health_desc': 'சாதாரண நிலை 0.76 (93% ஆரோக்கியம்)',
    'farmer.soil_moisture': 'மண் ஈரப்பதம்',
    'farmer.soil_moisture_desc': 'வேரில் போதுமான ஈரப்பதம் உள்ளது (58%)',
    'farmer.weather_risk': 'வானிலை அபாயம்',
    'farmer.weather_risk_desc': 'குறைந்த ஆபத்து; இயல்பான மழை முன்னறிவிப்பு',
    'farmer.disease_risk': 'நோய் ஆபத்து',
    'farmer.disease_risk_desc': 'பயிர் சுத்தமாக உள்ளது',
    'farmer.next_action': 'இன்றைய விவசாய ஆலோசனை',
    'farmer.next_action_desc': 'வெள்ளிக்கிழமை சொட்டு நீர் பாசனம் செய்யவும்',
    'farmer.actuate_pump': '45 நிமிட பாசன பம்பை இயக்கவும்',
    'farmer.halt_pump': 'பம்பை நிறுத்தவும்',
    'farmer.pump_running': 'பம்ப் இயங்குகிறது 💧',
    'farmer.pump_idle': 'பம்ப் நிறுத்தப்பட்டுள்ளது',

    // Visual Guides
    'guide.title': 'காட்சிப் பட வழிகாட்டி',
    'guide.subtitle': 'அம்புக்குறிகளைப் பின்தொடரவும் அல்லது குரல் ஆலோசனையைக் கேட்கவும்',
    'guide.step1': 'படி 1: பச்சை நிற பயிர் ஆரோக்கியத்தை சரிபார்க்கவும் 🟢',
    'guide.step2': 'படி 2: மண்ணின் ஈரப்பதத்தை சரிபார்க்கவும் 💧',
    'guide.step3': 'படி 3: பம்பை இயக்க பச்சை பொத்தானை அழுத்தவும் ⚡',
    'guide.step4': 'படி 4: உங்கள் பயிர் காப்பீட்டை சரிபார்க்கவும் 🛡️',
    'guide.audio_prompt': '🔊 இன்றைய விவசாய ஆலோசனையைக் கேட்க இங்கே தட்டவும்',
    'guide.audio_speaking': '🔊 தமிழில் குரல் ஆலோசனை ஒலிக்கிறது...',
    'guide.arrow_next': 'அடுத்த செயலுக்கு அம்புக்குறியைப் பின்தொடரவும் ➡️',
    'guide.arrow_down': 'கீழே பார்க்கவும் ⬇️',

    // Insurance
    'ins.title': 'பயிர் காப்பீட்டுப் பாதுகாப்பு',
    'ins.active_policy': 'செயலில் உள்ள பயிர் காப்பீடு',
    'ins.coverage_value': 'மொத்த காப்பீட்டுத் தொகை',
    'ins.trigger_condition': 'இழப்பீட்டு நிபந்தனை',
    'ins.zero_breaches': 'பயிர் முற்றிலும் பாதுகாப்பானது',
    'ins.apply_title': 'பயிர் காப்பீட்டு விண்ணப்பம்',
    'ins.apply_subtitle': 'காகிதமில்லா தானியங்கி வங்கி இழப்பீடு.',
    'ins.select_plot': 'படி 1: உங்கள் பண்ணையைத் தேர்ந்தெடுக்கவும்',
    'ins.select_plan': 'படி 2: காப்பீட்டுத் திட்டத்தைத் தேர்வு செய்யவும்',
    'ins.premium_calc': 'படி 3: மானியம் மற்றும் பிரீமியம் கணக்கீடு',
    'ins.bank_verify': 'படி 4: நேரடி வங்கி கணக்கு சரிபார்ப்பு',
    'ins.submit_app': 'விண்ணப்பத்தை சமர்ப்பிக்கவும் ➡️',
    'ins.submitting': 'சமர்ப்பிக்கப்படுகிறது...',
    'ins.status_pending': 'மதிப்பாய்வில் உள்ளது',
    'ins.status_approved': 'காப்பீடு அங்கீகரிக்கப்பட்டது',
    'ins.status_rejected': 'விண்ணப்பம் நிராகரிக்கப்பட்டது',
    'ins.sum_insured': 'காப்பீட்டுத் தொகை',
    'ins.gross_premium': 'மொத்த பிரீமியம்',
    'ins.govt_subsidy': 'அரசு மானியம் (80%)',
    'ins.farmer_pays': 'விவசாயி பங்கு (2% மட்டுமே)',
    'ins.view_policies': 'அனைத்து பாலிசிகளையும் காண்க',
    'ins.apply_new': 'புதிய காப்பீட்டிற்கு விண்ணப்பிக்கவும் ➡️',

    // Common
    'common.accept': 'ஏற்றுக்கொண்டு பாலிசியை வழங்கவும்',
    'common.reject': 'விண்ணப்பத்தை நிராகரிக்கவும்',
    'common.status': 'நிலை',
    'common.view': 'பார்க்க',
    'common.cancel': 'ரத்து செய்',
    'common.confirm': 'உறுதி செய்',
    'common.reason': 'நிராகரிப்பு காரணம்',
    'common.notes': 'மதிப்பீட்டாளர் குறிப்புகள்',

    // Extended Hero & Guidance Keys
    'nav.overview': 'கண்ணோட்டம்',
    'nav.workflow': '6-படி செயல்முறை',
    'nav.architecture': 'கட்டமைப்பு',
    'guide.step_health': 'பயிர் ஆரோக்கியம்',
    'guide.step_moisture': 'மண் ஈரப்பதம்',
    'guide.step_pump': 'நீர் பம்ப்',
    'guide.step_insurance': 'பயிர் காப்பீடு',
    'guide.listen': '🔊 கேளுங்கள்',
    'guide.listening': 'ஒலிக்கிறது...',
    'guide.listen_short': 'குரல்',
    'guide.apply_btn': '🛡️ காப்பீடு விண்ணப்பம்',
    'hero.badge': 'செயற்கைக்கோள் × IoT சென்சார் × தானியங்கி காப்பீடு',
    'hero.title_start': 'பயிர் இழப்பை முன்கூட்டியே தடுத்து',
    'hero.title_gradient': 'பாதுகாப்பான நடவடிக்கைகளை எடுங்கள்.',
    'hero.description': 'செயற்கைக்கோள் கண்காணிப்பு, IoT சென்சார்கள், AI பயிர் பகுப்பாய்வு மற்றும் நேரடி வங்கி இழப்பீட்டுடன் முழு விவசாய பாதுகாப்பு.',
    'hero.cta_farmer': 'விவசாய மையத்தைத் திறக்கவும்',
    'hero.cta_workflow': '6-படி வழிமுறை',
    'hero.cta_insurer': 'காப்பீட்டு மேசை',
    'hero.philosophy': '“தவிர்க்க முடியாத இயற்கை பேரிடர்கள் ஏற்படும் போது, விவசாயிகளுக்கு இழப்பீடு வழங்கி காப்பீடு பாதுகாக்கிறது. இது ஒரு பாதுகாப்பு வளையம்.”',
    'hero.runtime_title': 'தானியங்கி அமைப்பு செயல்பாடு',
    'hero.runtime_pilot': 'முக்கிய முன்னோடி: பண்ணை #204 (நதியா மாவட்டம்) • காரிஃப் பருவம்',
    'hero.card1_title': '1. செயற்கைக்கோள்',
    'hero.card1_desc': 'சென்டினல்-2 மற்றும் சென்டினல்-1 ரேடார் தகவல்',
    'hero.card2_title': '2. கள IoT',
    'hero.card2_desc': 'மண் ஈரப்பதம், வெப்பநிலை மற்றும் NPK சென்சார்கள்',
    'hero.card3_title': '3. விவசாய AI',
    'hero.card3_desc': 'உர சமநிலை மற்றும் பயிர் நோய் கண்டறிதல்',
    'hero.card4_title': '4. உடனடி நடவடிக்கை',
    'hero.card4_desc': 'தானியங்கி பாசன பம்ப் மற்றும் உரமிடுதல்',
    'hero.card5_title': '5. காப்பீட்டு பாதுகாப்பு',
    'hero.card5_desc': 'பாதிப்பு ஏற்பட்டால் நேரடியாக வங்கி கணக்கில் இழப்பீடு',
  },

  kn: {
    // Nav
    'nav.dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'nav.farms': 'ನನ್ನ ಜಮೀನುಗಳು',
    'nav.disease': 'ಬೆಳೆ ರೋಗ AI',
    'nav.optimization': 'ಗೊಬ್ಬರ ಮತ್ತು ನೀರು',
    'nav.iot': 'IoT ಪಂಪ್',
    'nav.insurance': 'ಬೆಳೆ ವಿಮೆ',
    'nav.apply_insurance': 'ವಿಮೆ ಅರ್ಜಿ',
    'nav.policy_review': 'ಪಾಲಿಸಿ ಪರಿಶೀಲನೆ',
    'nav.payments': 'ಬ್ಯಾಂಕ್ ಪರಿಹಾರ',
    'nav.underwriting': 'ವಿಮಾ ಡೆಸ್ಕ್',
    'nav.claims': 'ಕ್ಲೈಮ್‌ಗಳು',
    'nav.risk_map': 'ಅಪಾಯ ನಕ್ಷೆ',
    'nav.switch_role': 'ಪಾತ್ರ ಬದಲಾಯಿಸಿ',
    'nav.sign_in': 'ಲಾಗಿನ್',
    'nav.register': 'ಹೊಸ ನೋಂದಣಿ',
    'nav.visual_guide_active': 'ಚಿತ್ರ ಮಾರ್ಗದರ್ಶಿ',

    // Farmer Hub
    'farmer.greeting': 'ನಮಸ್ಕಾರ, ಸುಭಾಷ್ ಬಿಸ್ವಾಸ್',
    'farmer.selected_farm': 'ಆಯ್ಕೆಮಾಡಿದ ಜಮೀನು',
    'farmer.plot_name': 'ಜಮೀನು #204 (ನದಿಯಾ)',
    'farmer.crop_health': 'ಬೆಳೆ ಆರೋಗ್ಯ',
    'farmer.crop_health_status': 'ಉತ್ತಮ ಸ್ಥಿತಿ (0.71)',
    'farmer.crop_health_desc': 'ಸಾಮಾನ್ಯ ಮಟ್ಟ 0.76 (93% ಆರೋಗ್ಯಕರ)',
    'farmer.soil_moisture': 'ಮಣ್ಣಿನ ತೇವಾಂಶ',
    'farmer.soil_moisture_desc': 'ಬೇರಿನಲ್ಲಿ ಸಾಕಷ್ಟು ತೇವಾಂಶವಿದೆ (58%)',
    'farmer.weather_risk': 'ಹವಾಮಾನ ಅಪಾಯ',
    'farmer.weather_risk_desc': 'ಕಡಿಮೆ ಅಪಾಯ; ಸಾಮಾನ್ಯ ಮಳೆಯ ಮುನ್ಸೂಚನೆ',
    'farmer.disease_risk': 'ರೋಗದ ಅಪಾಯ',
    'farmer.disease_risk_desc': 'ಬೆಳೆ ಸ್ವಚ್ಛವಾಗಿದೆ',
    'farmer.next_action': 'ಇಂದಿನ ಕೃಷಿ ಸಲಹೆ',
    'farmer.next_action_desc': 'ಶುಕ್ರವಾರದಂದು ಹನಿ ನೀರಾವರಿ ಮಾಡಿ',
    'farmer.actuate_pump': '45 ನಿಮಿಷಗಳ ಪಂಪ್ ಪ್ರಾರಂಭಿಸಿ',
    'farmer.halt_pump': 'ಪಂಪ್ ನಿಲ್ಲಿಸಿ',
    'farmer.pump_running': 'ಪಂಪ್ ಚಾಲನೆಯಲ್ಲಿದೆ 💧',
    'farmer.pump_idle': 'ಪಂಪ್ ನಿಂತಿದೆ',

    // Visual Guides
    'guide.title': 'ಚಿತ್ರ ಮಾರ್ಗದರ್ಶಿ',
    'guide.subtitle': 'ಬಾಣದ ಗುರುತುಗಳನ್ನು ಅನುಸರಿಸಿ ಅಥವಾ ಧ್ವನಿ ಸಲಹೆ ಕೇಳಿ',
    'guide.step1': 'ಹಂತ 1: ಹಸಿರು ಬೆಳೆ ಆರೋಗ್ಯವನ್ನು ನೋಡಿ 🟢',
    'guide.step2': 'ಹಂತ 2: ಮಣ್ಣಿನ ತೇವಾಂಶ ಮಟ್ಟವನ್ನು ಪರಿಶೀಲಿಸಿ 💧',
    'guide.step3': 'ಹಂತ 3: ನೀರುಣಿಸಲು ಹಸಿರು ಬಟನ್ ಒತ್ತಿರಿ ⚡',
    'guide.step4': 'ಹಂತ 4: ನಿಮ್ಮ ಬೆಳೆ ವಿಮೆ ರಕ್ಷಣೆಯನ್ನು ನೋಡಿ 🛡️',
    'guide.audio_prompt': '🔊 ಇಂದಿನ ಕೃಷಿ ಸಲಹೆಗಳನ್ನು ಕೇಳಲು ಇಲ್ಲಿ ಸ್ಪರ್ಶಿಸಿ',
    'guide.audio_speaking': '🔊 ಕನ್ನಡದಲ್ಲಿ ಧ್ವನಿ ಸಲಹೆ ಕೇಳಿಸಲಾಗುತ್ತಿದೆ...',
    'guide.arrow_next': 'ಮುಂದಿನ ಹಂತಕ್ಕಾಗಿ ಬಾಣದ ಗುರುತನ್ನು ಅನುಸರಿಸಿ ➡️',
    'guide.arrow_down': 'ಕೆಳಗೆ ನೋಡಿ ⬇️',

    // Insurance
    'ins.title': 'ಬೆಳೆ ವಿಮೆ ರಕ್ಷಣೆ',
    'ins.active_policy': 'ಸಕ್ರಿಯ ಬೆಳೆ ವಿಮೆ ಪಾಲಿಸಿ',
    'ins.coverage_value': 'ಒಟ್ಟು ವಿಮಾ ಮೊತ್ತ',
    'ins.trigger_condition': 'ಪರಿಹಾರದ ಷರತ್ತು',
    'ins.zero_breaches': 'ಬೆಳೆ ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತವಾಗಿದೆ',
    'ins.apply_title': 'ಬೆಳೆ ವಿಮೆ ಅರ್ಜಿ',
    'ins.apply_subtitle': 'ಕಾಗದ ರಹಿತ ನೇರ ಬ್ಯಾಂಕ್ ಪರಿಹಾರ.',
    'ins.select_plot': 'ಹಂತ 1: ನಿಮ್ಮ ಜಮೀನನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    'ins.select_plan': 'ಹಂತ 2: ವಿಮಾ ರಕ್ಷಣೆಯನ್ನು ಆರಿಸಿ',
    'ins.premium_calc': 'ಹಂತ 3: ಸರ್ಕಾರದ ಸಬ್ಸಿಡಿ ಮತ್ತು ಪ್ರೀಮಿಯಂ ಲೆಕ್ಕಾಚಾರ',
    'ins.bank_verify': 'ಹಂತ 4: ಬ್ಯಾಂಕ್ ಖಾತೆ ಪರಿಶೀಲನೆ',
    'ins.submit_app': 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ➡️',
    'ins.submitting': 'ಸಲ್ಲಿಸಲಾಗುತ್ತಿದೆ...',
    'ins.status_pending': 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
    'ins.status_approved': 'ವಿಮೆ ಅನುಮೋದಿಸಲಾಗಿದೆ',
    'ins.status_rejected': 'ಅರ್ಜಿ ತಿರಸ್ಕರಿಸಲಾಗಿದೆ',
    'ins.sum_insured': 'ವಿಮಾ ಮೊತ್ತ',
    'ins.gross_premium': 'ಒಟ್ಟು ಪ್ರೀಮಿಯಂ',
    'ins.govt_subsidy': 'ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ (80%)',
    'ins.farmer_pays': 'ರೈತರ ಪಾಲು (ಕೇವಲ 2%)',
    'ins.view_policies': 'ಎಲ್ಲಾ ಪಾಲಿಸಿಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
    'ins.apply_new': 'ಹೊಸ ವಿಮೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ ➡️',

    // Common
    'common.accept': 'ಅನುಮೋದಿಸಿ ಮತ್ತು ಪಾಲಿಸಿ ನೀಡಿ',
    'common.reject': 'ಅರ್ಜಿಯನ್ನು ತಿರಸ್ಕರಿಸಿ',
    'common.status': 'ಸ್ಥಿತಿ',
    'common.view': 'ವೀಕ್ಷಿಸಿ',
    'common.cancel': 'ರದ್ದುಮಾಡಿ',
    'common.confirm': 'ಖಚಿತಪಡಿಸಿ',
    'common.reason': 'ತಿರಸ್ಕಾರದ ಕಾರಣ',
    'common.notes': 'ಅಂಡರ್‌ರೈಟರ್ ಟಿಪ್ಪಣಿಗಳು',

    // Extended Hero & Guidance Keys
    'nav.overview': 'ಅವಲೋಕನ',
    'nav.workflow': '6 ಹಂತದ ವಿಧಾನ',
    'nav.architecture': 'ವಿನ್ಯಾಸ',
    'guide.step_health': 'ಬೆಳೆ ಆರೋಗ್ಯ',
    'guide.step_moisture': 'ಮಣ್ಣಿನ ತೇವಾಂಶ',
    'guide.step_pump': 'ನೀರಿನ ಪಂಪ್',
    'guide.step_insurance': 'ಬೆಳೆ ವಿಮೆ',
    'guide.listen': '🔊 ಕೇಳಿ',
    'guide.listening': 'ಕೇಳಿಸುತ್ತಿದೆ...',
    'guide.listen_short': 'ಧ್ವನಿ',
    'guide.apply_btn': '🛡️ ವಿಮೆ ಅರ್ಜಿ',
    'hero.badge': 'ಉಪಗ್ರಹ ಕಣ್ಗಾವಲು × IoT ಸಂವೇದಕಗಳು × ಬೆಳೆ ವಿಮೆ',
    'hero.title_start': 'ಬೆಳೆ ನಷ್ಟವಾಗುವ ಮುನ್ನವೇ',
    'hero.title_gradient': 'ಮುನ್ನೆಚ್ಚರಿಕೆ ಕ್ರಮ ಕೈಗೊಳ್ಳಿ.',
    'hero.description': 'ಉಪಗ್ರಹ ಮಾಹಿತಿ, IoT ಸಂವೇದಕಗಳು, AI ಬೆಳೆ ಆರೋಗ್ಯ ತಪಾಸಣೆ ಮತ್ತು ನೇರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಪರಿಹಾರ ನೀಡುವ ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ರಕ್ಷಣೆ.',
    'hero.cta_farmer': 'ರೈತ ಕೇಂದ್ರ ತೆರೆಯಿರಿ',
    'hero.cta_workflow': '6-ಹಂತದ ಕಾರ್ಯವಿಧಾನ',
    'hero.cta_insurer': 'ವಿಮಾ ಡೆಸ್ಕ್',
    'hero.philosophy': '“ಅನಿವಾರ್ಯ ನೈಸರ್ಗಿಕ ವಿಕೋಪಗಳು ಸಂಭವಿಸಿದಾಗ, ಬೆಳೆ ವಿಮೆಯು ರೈತರಿಗೆ ಆರ್ಥಿಕ ರಕ್ಷಣೆ ನೀಡುತ್ತದೆ. ಇದು ಸುರಕ್ಷತಾ ಕವಚ.”',
    'hero.runtime_title': 'ಕ್ಲೋಸ್ಡ್-ಲೂಪ್ ಸಿಸ್ಟಮ್ ರನ್‌ಟೈಮ್',
    'hero.runtime_pilot': 'ಮುಖ್ಯ ಪ್ರಾಯೋಗಿಕ: ಜಮೀನು #204 (ನದಿಯಾ ಜಿಲ್ಲೆ) • ಖಾರೀಫ್ ಹಂಗಾಮು',
    'hero.card1_title': '1. ಉಪಗ್ರಹ',
    'hero.card1_desc': 'ಸೆಂಟಿನೆಲ್-2 ಮತ್ತು ಸೆಂಟಿನೆಲ್-1 ರೇಡಾರ್ ಮಾಹಿತಿ',
    'hero.card2_title': '2. ಕ್ಷೇತ್ರ IoT',
    'hero.card2_desc': 'ಮಣ್ಣಿನ ತೇವಾಂಶ ಮತ್ತು NPK ಸಂವೇದಕ ಮಾಹಿತಿ',
    'hero.card3_title': '3. ಕೃಷಿ AI',
    'hero.card3_desc': 'ಗೊಬ್ಬರ ಸಮತೋಲನ ಮತ್ತು ಬೆಳೆ ರೋಗ ಪತ್ತೆ',
    'hero.card4_title': '4. ತಕ್ಷಣದ ಕ್ರಮ',
    'hero.card4_desc': 'ಸ್ವಯಂಚಾಲಿತ ನೀರಾವರಿ ಪಂಪ್ ಮತ್ತು ಪೋಷಕಾಂಶ',
    'hero.card5_title': '5. ವಿಮಾ ರಕ್ಷಣೆ',
    'hero.card5_desc': 'ಹಾನಿಯಾದ ತಕ್ಷಣ ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಪರಿಹಾರ',
  },

  ml: {
    // Nav
    'nav.dashboard': 'ഡാഷ്‌ബോർഡ്',
    'nav.farms': 'എന്റെ കൃഷിയിടങ്ങൾ',
    'nav.disease': 'വിള രോഗനിർണയ AI',
    'nav.optimization': 'വളവും വെള്ളവും',
    'nav.iot': 'IoT പമ്പ്',
    'nav.insurance': 'വിള ഇൻഷുറൻസ്',
    'nav.apply_insurance': 'ഇൻഷുറൻസ് അപേക്ഷ',
    'nav.policy_review': 'പോളിസി പരിശോധന',
    'nav.payments': 'ബാങ്ക് നഷ്ടപരിഹാരം',
    'nav.underwriting': 'ഇൻഷുറൻസ് ഡെസ്ക്',
    'nav.claims': 'ക്ലെയിമുകൾ',
    'nav.risk_map': 'റിസ്ക് മാപ്പ്',
    'nav.switch_role': 'റോൾ മാറ്റുക',
    'nav.sign_in': 'ലോഗിൻ',
    'nav.register': 'രജിസ്ട്രേഷൻ',
    'nav.visual_guide_active': 'ചിത്ര വഴികാട്ടി',

    // Farmer Hub
    'farmer.greeting': 'നമസ്കാരം, സുഭാഷ് ബിസ്വാസ്',
    'farmer.selected_farm': 'തിരഞ്ഞെടുത്ത കൃഷിയിടം',
    'farmer.plot_name': 'പ്ലോട്ട് #204 (നാദിയ)',
    'farmer.crop_health': 'വിളയുടെ ആരോഗ്യം',
    'farmer.crop_health_status': 'മികച്ച അവസ്ഥ (0.71)',
    'farmer.crop_health_desc': 'സാധാരണ നില 0.76 (93% ആരോഗ്യം)',
    'farmer.soil_moisture': 'മണ്ണിലെ ഈർപ്പം',
    'farmer.soil_moisture_desc': 'വേരുകളിൽ ആവശ്യത്തിന് ഈർപ്പമുണ്ട് (58%)',
    'farmer.weather_risk': 'കാലാവസ്ഥാ അപകടസാധ്യത',
    'farmer.weather_risk_desc': 'കുറഞ്ഞ അപകടസാധ്യത; സാധാരണ മഴ സാധ്യത',
    'farmer.disease_risk': 'രോഗ സാധ്യത',
    'farmer.disease_risk_desc': 'വിള സുരക്ഷിതമാണ്',
    'farmer.next_action': 'ഇന്നത്തെ കാർഷിക ഉപദേശം',
    'farmer.next_action_desc': 'വെള്ളിയാഴ്ച ഡ്രിപ്പ് ഇറിഗേഷൻ നൽകുക',
    'farmer.actuate_pump': '45 മിനിറ്റ് പമ്പ് പ്രവർത്തിപ്പിക്കുക',
    'farmer.halt_pump': 'പമ്പ് നിർത്തുക',
    'farmer.pump_running': 'പമ്പ് പ്രവർത്തിക്കുന്നു 💧',
    'farmer.pump_idle': 'പമ്പ് നിർത്തിയിരിക്കുന്നു',

    // Visual Guides
    'guide.title': 'ചിത്ര വഴികാട്ടി',
    'guide.subtitle': 'അമ്പടയാളങ്ങൾ പിന്തുടരുക അല്ലെങ്കിൽ ശബ്ദ സന്ദേശം കേൾക്കുക',
    'guide.step1': 'ഘട്ടം 1: പച്ച നിറത്തിലുള്ള വിളയുടെ ആരോഗ്യം കാണുക 🟢',
    'guide.step2': 'ഘട്ടം 2: മണ്ണിലെ ഈർപ്പത്തിന്റെ അളവ് പരിശോധിക്കുക 💧',
    'guide.step3': 'ഘട്ടം 3: നനയ്ക്കാൻ പച്ച ബട്ടൺ അമർത്തുക ⚡',
    'guide.step4': 'ഘട്ടം 4: നിങ്ങളുടെ ഇൻഷുറൻസ് സുരക്ഷ പരിശോധിക്കുക 🛡️',
    'guide.audio_prompt': '🔊 ഇന്നത്തെ കാർഷിക ഉപദേശം കേൾക്കാൻ ഇവിടെ അമർത്തുക',
    'guide.audio_speaking': '🔊 മലയാളത്തിൽ ശബ്ദ ഉപദേശം കേൾപ്പിക്കുന്നു...',
    'guide.arrow_next': 'അടുത്ത ഘട്ടത്തിനായി അമ്പടയാളം പിന്തുടരുക ➡️',
    'guide.arrow_down': 'താഴേക്ക് നോക്കുക ⬇️',

    // Insurance
    'ins.title': 'പാരമെട്രിക് വിള ഇൻഷുറൻസ്',
    'ins.active_policy': 'സജീവ വിള ഇൻഷുറൻസ് പോളിസി',
    'ins.coverage_value': 'ആകെ ഇൻഷുറൻസ് തുക',
    'ins.trigger_condition': 'നഷ്ടപരിഹാര വ്യവസ്ഥ',
    'ins.zero_breaches': 'വിള പൂർണ്ണമായും സുരക്ഷിതമാണ്',
    'ins.apply_title': 'വിള ഇൻഷുറൻസ് അപേക്ഷ',
    'ins.apply_subtitle': 'പേപ്പർ രഹിത നേരിട്ടുള്ള ബാങ്ക് നഷ്ടപരിഹാരം.',
    'ins.select_plot': 'ഘട്ടം 1: നിങ്ങളുടെ കൃഷിയിടം തിരഞ്ഞെടുക്കുക',
    'ins.select_plan': 'ഘട്ടം 2: ഇൻഷുറൻസ് പരിരക്ഷ തിരഞ്ഞെടുക്കുക',
    'ins.premium_calc': 'ഘട്ടം 3: സർക്കാർ സബ്‌സിഡിയും പ്രീമിയവും കണക്കാക്കൽ',
    'ins.bank_verify': 'ഘട്ടം 4: ബാങ്ക് അക്കൗണ്ട് പരിശോധന',
    'ins.submit_app': 'അപേക്ഷ സമർപ്പിക്കുക ➡️',
    'ins.submitting': 'സമർപ്പിക്കുന്നു...',
    'ins.status_pending': 'പരിശോധനയിലാണ്',
    'ins.status_approved': 'ഇൻഷുറൻസ് അനുവദിച്ചു',
    'ins.status_rejected': 'അപേക്ഷ നിരസിച്ചു',
    'ins.sum_insured': 'ഇൻഷുറൻസ് തുക',
    'ins.gross_premium': 'ആകെ പ്രീമിയം',
    'ins.govt_subsidy': 'സർക്കാർ സബ്‌സിഡി (80%)',
    'ins.farmer_pays': 'കർഷകന്റെ വിഹിതം (2% മാത്രം)',
    'ins.view_policies': 'എല്ലാ പോളിസികളും കാണുക',
    'ins.apply_new': 'പുതിയ ഇൻഷുറൻസിനായി അപേക്ഷിക്കുക ➡️',

    // Common
    'common.accept': 'അംഗീകരിച്ച് പോളിസി നൽകുക',
    'common.reject': 'അപേക്ഷ നിരസിക്കുക',
    'common.status': 'നില',
    'common.view': 'കാണുക',
    'common.cancel': 'റദ്ദാക്കുക',
    'common.confirm': 'സ്ഥിരീകരിക്കുക',
    'common.reason': 'നിരസിക്കാനുള്ള കാരണം',
    'common.notes': 'അണ്ടർറൈറ്റർ കുറിപ്പുകൾ',

    // Extended Hero & Guidance Keys
    'nav.overview': 'അവലോകനം',
    'nav.workflow': '6 ഘട്ട പ്രവർത്തനം',
    'nav.architecture': 'ഘടന',
    'guide.step_health': 'വിള ആരോഗ്യം',
    'guide.step_moisture': 'മണ്ണിലെ ഈർപ്പം',
    'guide.step_pump': 'വാട്ടർ പമ്പ്',
    'guide.step_insurance': 'വിള ഇൻഷുറൻസ്',
    'guide.listen': '🔊 കേൾക്കുക',
    'guide.listening': 'കേൾപ്പിക്കുന്നു...',
    'guide.listen_short': 'ശബ്ദം',
    'guide.apply_btn': '🛡️ ഇൻഷുറൻസ് അപേക്ഷ',
    'hero.badge': 'ഉപഗ്രഹ നിരീക്ഷണം × ഐഒടി സെൻസറുകൾ × വിള ഇൻഷുറൻസ്',
    'hero.title_start': 'വിളനാശം സംഭവിക്കുന്നതിന് മുമ്പ്',
    'hero.title_gradient': 'കൃത്യമായ സംരക്ഷണം ഉറപ്പാക്കുക.',
    'hero.description': 'ഉപഗ്രഹ വിവരങ്ങൾ, IoT സെൻസറുകൾ, AI വിള പരിശോധന, ബാങ്ക് അക്കൗണ്ടിലേക്ക് നേരിട്ടുള്ള നഷ്ടപരിഹാരം എന്നിവയോടെ മികച്ച കാർഷിക സുരക്ഷ.',
    'hero.cta_farmer': 'കർഷക ഹബ് തുറക്കുക',
    'hero.cta_workflow': '6 ഘട്ട പ്രവർത്തനങ്ങൾ',
    'hero.cta_insurer': 'ഇൻഷുറൻസ് ഡെസ്ക്',
    'hero.philosophy': '“പ്രകൃതിദുരന്തങ്ങൾ ഉണ്ടാകുമ്പോൾ കർഷകർക്ക് സാമ്പത്തിക നഷ്ടമുണ്ടാകാതെ വിള ഇൻഷുറൻസ് സംരക്ഷണം നൽകുന്നു.”',
    'hero.runtime_title': 'ഓട്ടോമേറ്റഡ് സിസ്റ്റം റൺടൈം',
    'hero.runtime_pilot': 'പ്രധാന പൈലറ്റ്: പ്ലോട്ട് #204 (നാദിയ ജില്ല) • ഖാരിഫ് സീസൺ',
    'hero.card1_title': '1. ഉപഗ്രഹം',
    'hero.card1_desc': 'സെന്റിനൽ-2, സെന്റിനൽ-1 റഡാർ വിവരങ്ങൾ',
    'hero.card2_title': '2. ഫീൽഡ് IoT',
    'hero.card2_desc': 'മണ്ണിലെ ഈർപ്പവും NPK സെൻസറുകളും',
    'hero.card3_title': '3. കാർഷിക AI',
    'hero.card3_desc': 'പോഷക സന്തുലിതാവസ്ഥയും രോഗനിർണയവും',
    'hero.card4_title': '4. ഇടപെടൽ',
    'hero.card4_desc': 'ഓട്ടോമാറ്റിക് പമ്പ് പ്രവർത്തനവും വളപ്രയോഗവും',
    'hero.card5_title': '5. ഇൻഷുറൻസ് പരിരക്ഷ',
    'hero.card5_desc': 'നാശനഷ്ടമുണ്ടായാൽ ബാങ്ക് അക്കൗണ്ടിലേക്ക് നേരിട്ട് നഷ്ടപരിഹാരം',
  },
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  showVisualGuide: boolean;
  setShowVisualGuide: (show: boolean) => void;
  playVoiceAdvisory: () => void;
  isSpeaking: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key, fallback) => fallback || key,
  showVisualGuide: false,
  setShowVisualGuide: () => {},
  playVoiceAdvisory: () => {},
  isSpeaking: false,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [showVisualGuide, setShowVisualGuide] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('agrisure_language') as LanguageCode;
      if (savedLang && ['en', 'bn', 'hi', 'te', 'ta', 'kn', 'ml'].includes(savedLang)) {
        setLanguageState(savedLang);
        setShowVisualGuide(savedLang !== 'en');
      }
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    // Automatically enable visual directional guides & arrows when non-English is chosen
    const shouldGuide = lang !== 'en';
    setShowVisualGuide(shouldGuide);
    if (typeof window !== 'undefined') {
      localStorage.setItem('agrisure_language', lang);
    }
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const enDict = TRANSLATIONS['en'];
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  };

  const playVoiceAdvisory = () => {
    setIsSpeaking(true);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak =
        t('farmer.greeting') +
        '. ' +
        t('farmer.crop_health') +
        ': ' +
        t('farmer.crop_health_status') +
        '. ' +
        t('farmer.soil_moisture') +
        ': ' +
        t('farmer.soil_moisture_desc') +
        '. ' +
        t('farmer.next_action') +
        ': ' +
        t('farmer.next_action_desc');
      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      const langMap: Record<LanguageCode, string> = {
        en: 'en-IN',
        bn: 'bn-IN',
        hi: 'hi-IN',
        te: 'te-IN',
        ta: 'ta-IN',
        kn: 'kn-IN',
        ml: 'ml-IN',
      };
      utterance.lang = langMap[language] || 'en-IN';
      utterance.rate = 0.88;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 3500);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        showVisualGuide,
        setShowVisualGuide,
        playVoiceAdvisory,
        isSpeaking,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
