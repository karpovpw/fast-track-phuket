import urllib.request
import urllib.parse
import json
import time

en_dict = {
  "nav.badge": "Official VIP partner of Phuket Airport HKT • Since 2013",
  "hero.title": "Skip the Queues at Phuket Airport",
  "hero.subtitle": "Phuket Airport Fast Track is a VIP service that lets you bypass immigration and customs queues at HKT airport. Arrival processing in under 5 minutes.",
  "hero.cta.wa": "Book Fast Track via WhatsApp",
  "hero.cta.tg": "Book Fast Track via Telegram",
  
  "takeaways.title": "🔑 Key Takeaways",
  "takeaways.1": "Skip immigration queues in under 5 minutes with a personal escort.",
  "takeaways.2": "Available for all international flights at HKT daily from 06:00 to midnight.",
  "takeaways.3": "Arrival from ฿1,600/person · Departure from ฿1,700/person.",
  "takeaways.4": "Free rebooking or full refund for delayed/cancelled flights.",
  "takeaways.5": "Children aged 0-2 travel free; under 12 get 50% off.",

  "calc.title": "Fast Track Pricing Calculator",
  "calc.subtitle": "Calculate your official VIP Airport Fast Track total. Our agency guarantees the lowest price in Phuket since 2013.",
  "calc.service": "Select Service",
  "calc.adults": "Number of Adults",
  "calc.kids": "Children (under 12, 50% off)",
  "calc.infants": "Infants (0-2 years, Free)",
  "calc.total": "Total Estimated Cost: ฿",

  "packages.title": "Phuket Airport Fast Track Prices 2026",
  "packages.subtitle": "Operating since 2013, we offer the lowest official price for VIP Fast Track at HKT.",
  "packages.th1": "Service Package",
  "packages.th2": "1 Passenger",
  "packages.th3": "2+ Passengers (Group)",
  "packages.th4": "Children (under 12)",
  "packages.th5": "Infants (0-2 years)",
  "packages.arr.title": "Arrival Fast Track",
  "packages.arr.features": "Land and leave in minutes|Personal meet at gate or immigration zone|Express immigration lane (priority window)|Terminal guidance & exit assistance|Flight delay coordination|Chat support until service completion",
  "packages.dep.title": "Departure VIP",
  "packages.dep.features": "Breeze through check-in & security|Personal meet at terminal entrance|Check-in assistance (if needed)|Priority immigration & security screening|Express passport control|Gate escort & chat support",
  "packages.combo.title": "Combo Package",
  "packages.combo.badge": "BEST VALUE",
  "packages.combo.features": "Arrival + Departure VIP|Full arrival fast track service|Full departure VIP service|Priority rebooking guarantee|TDAC form assistance|Dedicated WhatsApp support|Flight delay coordination",
  "packages.footer": "* Infants (0-2 years) always travel completely FREE. Prices include all official airport fees and taxes.",
  
  "compare.title": "VIP Fast Track vs. Regular Phuket Immigration",
  "compare.subtitle": "Compare our VIP meet & assist service with standard airport procedures at HKT.",
  "compare.f1": "Immigration Wait", "compare.r1.1": "30-60+ Minutes", "compare.r1.2": "Under 5 Minutes",
  "compare.f2": "Personal Assistance", "compare.r2.1": "None (Self-navigation)", "compare.r2.2": "Personal Concierge (Gate-to-Exit)",
  "compare.f3": "Processing Lane", "compare.r3.1": "Standard Public Queues", "compare.r3.2": "Dedicated VIP Fast-Track Lane",
  "compare.f4": "Flight Monitoring", "compare.r4.1": "None", "compare.r4.2": "Real-time Arrival/Departure Tracking",
  "compare.f5": "Arrival/Departure Point", "compare.r5.1": "N/A", "compare.r5.2": "Aircraft Bridge or Terminal Entrance",
  "compare.f6": "Document Support", "compare.r6.1": "No Assistance", "compare.r6.2": "Full Help with Mandatory Entry Forms",
  "compare.f7": "Transfer Help", "compare.r7.1": "No", "compare.r7.2": "Taxi / Driver Coordination",

  "steps.title": "Book in 4 Simple Steps",
  "steps.1.title": "1. Message Us", "steps.1.desc": "Send your flight details via WhatsApp/Telegram.",
  "steps.2.title": "2. Get Confirmation", "steps.2.desc": "Receive booking confirmation and escort's contact info.",
  "steps.3.title": "3. Meet Your Escort", "steps.3.desc": "Your escort meets you at the agreed point (plane gate or terminal entrance).",
  "steps.4.title": "4. Skip the Queues", "steps.4.desc": "Walk through express VIP lanes in under 5 minutes.",

  "reviews.title": "What Travelers Say About Our Service",
  "reviews.1.n": "John D.", "reviews.1.t": "Life saver!", "reviews.1.d": "Skipped a 2-hour queue at HKT. The concierge was already waiting at the gate.",
  "reviews.2.n": "Maria S.", "reviews.2.t": "Perfect for families", "reviews.2.d": "Traveling with kids was so much easier. Fast, efficient, and very polite.",
  "reviews.3.n": "Viktor K.", "reviews.3.t": "Worth every cent", "reviews.3.d": "Professional service from start to finish. Best way to start a holiday in Phuket.",
  "reviews.4.n": "Sarah M.", "reviews.4.t": "Smooth and stress-free", "reviews.4.d": "I was nervous about arriving in Thailand, but the escort made everything seamless.",
  "reviews.5.n": "David L.", "reviews.5.t": "Excellent coordination", "reviews.5.d": "My flight was delayed, but the team adjusted automatically without any extra charge.",
  "reviews.6.n": "Elena R.", "reviews.6.t": "Incredible VIP feeling", "reviews.6.d": "From landing to the taxi, everything took me exactly 6 minutes.",
  "reviews.7.n": "Lucas H.", "reviews.7.t": "Highly recommended", "reviews.7.d": "The dedicated priority lane was completely empty. I'll use this every time from now on.",
  "reviews.8.n": "Priya T.", "reviews.8.t": "Friendly and helpful", "reviews.8.d": "The staff helped me carry my bags and navigated me to the driver.",
  "reviews.9.n": "Ahmed Y.", "reviews.9.t": "Great value", "reviews.9.d": "Given how long the normal line was, the price was absolutely worth the time saved.",
  "reviews.10.n": "Emma P.", "reviews.10.t": "Flawless service", "reviews.10.d": "Very polite staff, accurate communication, and delivered exactly what was promised.",

  "team.title": "Airport Professionals You Can Trust",
  "team.subtitle": "Our experienced team has processed over 10,000 travelers at Phuket International Airport since 2019.",
  "team.w1.n": "Kittipong", "team.w1.r": "Service Manager", "team.w1.d": "Coordinates VIP arrivals and handles complex logistics.",
  "team.w2.n": "Nantana", "team.w2.r": "Client Support", "team.w2.d": "Personal concierge for international travelers.",
  "team.w3.n": "Somchai", "team.w3.r": "Airport Operations", "team.w3.d": "Liaison with official immigration and customs authorities.",

  "payments.title": "Payment Methods",
  "payments.subtitle": "We accept multiple payment options. Prepayment is required to guarantee your booking.",
  "payments.1.t": "Bank Transfer", "payments.1.d": "Thai bank QR payment in THB.",
  "payments.2.t": "USDT/USDC Crypto", "payments.2.d": "Any network (TRC20, ERC20, BEP20, etc.) accepted.",
  "payments.3.t": "Cash via Courier", "payments.3.d": "Bolt courier cash pickup — by arrangement.",
  "payments.4.t": "Online Card Payment", "payments.4.d": "Secure online payment via internet acquiring.",
  "payments.5.t": "SWIFT Transfer", "payments.5.d": "International bank wire transfer available.",

  "guides.title": "Latest Airport & Travel Guides",
  "guides.subtitle": "Expert tips and practical guides for your Phuket trip.",
  "guides.tdac.t": "Official Thailand Arrival Card (TDAC)",
  "guides.tdac.d": "Complete the official digital arrival form required for all international travelers entering Thailand. Our guide explains how to do it for free in under 5 minutes. Avoid common agency scams.",
  "guides.1.t": "Arrival Guide 2026", "guides.1.d": "Complete guide to arriving at Phuket Airport.",
  "guides.2.t": "What Is Fast Track?", "guides.2.d": "How VIP airport fast track works, what's included.",
  "guides.3.t": "Entry Requirements", "guides.3.d": "Everything you need to enter Thailand in 2026 — visa, TDAC, etc.",
  
  "faq.title": "Phuket Airport Fast Track FAQ",
  "faq.1.q": "What happens if my flight to Phuket is delayed?",
  "faq.1.a": "We monitor all flights in real-time. If your flight is delayed, your VIP Fast Track escort adjusts their schedule automatically at no extra charge. In case of flight cancellation, you receive a full refund or free rebooking for your new flight date.",
  "faq.2.q": "Do I still need to fill out the Thailand TDAC form for 2026?",
  "faq.2.a": "Yes, all international travelers must complete the Thailand Digital Arrival Card (TDAC) before arrival, regardless of Fast Track service. Our Phuket Airport Combo Package includes full TDAC assistance. We also provide a free step-by-step TDAC guide on our website.",
  "faq.3.q": "How far in advance should I book VIP Meet & Assist?",
  "faq.3.a": "We recommend booking at least 24 hours before your flight for guaranteed availability. Same-day bookings may be available depending on current demand. During peak season in Phuket (November–March), booking 48–72 hours ahead is highly advisable to skip the 2-hour lines.",
  "faq.4.q": "Is Fast Track available for all airlines at Phuket Airport?",
  "faq.4.a": "Yes, Fast Track service is available for all international flights at Phuket International Airport (HKT), operating daily from 06:00 to midnight. This covers all major airlines including Thai Airways, Bangkok Airways, AirAsia, Singapore Airlines, Qatar Airways, Emirates, and more.",
  "faq.5.q": "How fast is the VIP process?",
  "faq.5.a": "Under 5 minutes compared to standard immigration waits of over 60 minutes.",
  "faq.6.q": "How will I find my professional concierge?",
  "faq.6.a": "At the aircraft bridge (Arrivals) or Terminal entrance (Departures) holding a sign with your name.",
  "faq.7.q": "Do you help with mandatory Thai entry forms?",
  "faq.7.a": "Yes, our team assists you in filling out all mandatory immigration and customs forms correctly.",

  "footer.legal": "© 2013-2026 Phuket Airport Fast Track. All rights reserved.",
  "modal.close": "Close Window",

  "tdac_modal.title": "Thailand Digital Arrival Card Guide",
  "tdac_modal.p1": "The official TDAC form is required for 2026 entry.",
  "tdac_modal.scam_title": "⚠️ SCAM PROTECTION",
  "tdac_modal.scam_desc": "The official portal is 100% free. Never pay for this form. Use ONLY tdac.immigration.go.th.",
  "tdac_modal.guide_title": "Filing Guide:",
  "tdac_modal.step1": "Register at the official portal 72h before landing.",
  "tdac_modal.step2": "Port: Select Phuket Airport (HKT).",
  "tdac_modal.step3": "Accurately input passport and flight TG/EK numbers.",
  "tdac_modal.step4": "Save the resulting QR code – you MUST show it on your phone.",

  "modal.terms.title": "Terms & Conditions",
  "modal.terms.desc": "Service is non-refundable 24 hours prior to arrival. 100% refund if the airline cancels the flight. We track all delays automatically.",
  "modal.privacy.title": "Privacy Policy",
  "modal.privacy.desc": "We securely process your name and flight number only for coordination. Data is wiped after service completion. Conversations via WhatsApp/Telegram are end-to-end encrypted."
}

with open('src/locales/en.json', 'w', encoding='utf-8') as f:
    json.dump(en_dict, f, ensure_ascii=False, indent=2)

languages = ['ru', 'zh-CN', 'hi', 'he', 'ar', 'es', 'fr', 'de', 'it']

def translate_text(text, target_lang):
    if not text: return ""
    try:
        url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=" + target_lang + "&dt=t&q=" + urllib.parse.quote(text)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        return ''.join([sentence[0] for sentence in data[0] if sentence[0]])
    except Exception as e:
        print(f"Error translating: {text[:20]} -> {e}")
        return text

for lang in languages:
    print(f"Translating to {lang}...")
    lang_dict = {}
    for k, v in en_dict.items():
        if isinstance(v, str) and not k.endswith('.n'):
            lang_dict[k] = translate_text(v, lang)
            time.sleep(0.1) # Be nice to Google
        else:
            lang_dict[k] = v
    # Save mapping properly
    filename = 'zh.json' if lang == 'zh-CN' else f"{lang}.json"
    with open(f'src/locales/{filename}', 'w', encoding='utf-8') as f:
        json.dump(lang_dict, f, ensure_ascii=False, indent=2)
print("All languages generated successfully!")
