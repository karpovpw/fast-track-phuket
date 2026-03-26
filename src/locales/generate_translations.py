import urllib.request
import urllib.parse
import json
import time

en_dict = {
  "nav.badge": "Official VIP partner of Phuket Airport HKT • Since 2015",
  "hero.title": "Skip the Queues at Phuket Airport",
  "hero.subtitle": "Phuket Airport Fast Track is a VIP service that lets you bypass immigration and customs queues at HKT airport. Arrival processing in under 5 minutes.",
  "hero.cta.wa": "Book Fast Track via WhatsApp",
  "hero.cta.tg": "Book Fast Track via Telegram",
  
  "takeaways.title": "🔑 Key Takeaways",
  "takeaways.1": "Skip immigration queues in under 5 minutes with a personal escort.",
  "takeaways.2": "Available for all international flights at HKT daily from 06:00 to midnight.",
  "takeaways.3": "Arrival from ฿1,650/person · Departure from ฿1,750/person.",
  "takeaways.4": "Free rebooking or full refund for delayed/cancelled flights.",
  "takeaways.5": "Children aged 0-2 travel free; under 12 get 50% off.",

  "calc.title": "Estimate Your Total Cost",
  "calc.subtitle": "Select your service and number of passengers to see the total price instantly.",
  "calc.service": "Select Service",
  "calc.adults": "Number of Adults",
  "calc.kids": "Children (under 12, 50% off)",
  "calc.total": "Total Estimated Cost: ฿",

  "packages.title": "Choose Your Fast Track Package",
  "packages.subtitle": "All packages include a personal escort and express immigration processing.",
  "packages.arr.title": "Arrival Fast Track",
  "packages.arr.desc": "Land and leave in minutes. Personal meet at gate. Express priority immigration lane. Chat support.",
  "packages.dep.title": "Departure VIP",
  "packages.dep.desc": "Breeze through check-in & security. Personal meet at terminal entrance. Priority immigration & escort.",
  "packages.combo.title": "Combo Package ⭐",
  "packages.combo.desc": "Arrival + Departure VIP. Full service round-trip. Priority rebooking guarantee. Best value.",
  
  "compare.title": "Fast Track vs Regular Immigration",
  "compare.subtitle": "See exactly what you get with our VIP service compared to the standard process.",
  "compare.f1": "Wait time", "compare.r1.1": "30-60 minutes", "compare.r1.2": "Under 5 minutes ✓",
  "compare.f2": "Personal escort", "compare.r2.1": "✗ No", "compare.r2.2": "✓ Yes, gate-to-exit",
  "compare.f3": "Dedicated VIP lane", "compare.r3.1": "✗ No", "compare.r3.2": "✓ Yes",
  "compare.f4": "Flight tracking", "compare.r4.1": "✗ No", "compare.r4.2": "✓ Real-time tracking",

  "steps.title": "Book in 4 Simple Steps",
  "steps.1.title": "1. Message Us", "steps.1.desc": "Send your flight details via WhatsApp/Telegram.",
  "steps.2.title": "2. Get Confirmation", "steps.2.desc": "Receive booking confirmation and escort's contact info.",
  "steps.3.title": "3. Meet Your Escort", "steps.3.desc": "Your escort meets you at the agreed point (plane gate or terminal entrance).",
  "steps.4.title": "4. Skip the Queues", "steps.4.desc": "Walk through express VIP lanes in under 5 minutes.",

  "reviews.title": "What Travelers Say About Our Service",

  "team.title": "Airport Professionals You Can Trust",
  "team.subtitle": "Our experienced team has processed over 10,000 travelers at Phuket International Airport since 2019.",

  "payments.title": "Payment Methods",
  "payments.subtitle": "We accept multiple payment options. Prepayment is required to guarantee your booking.",
  "payments.1.t": "Bank Transfer", "payments.1.d": "Thai bank QR payment in THB.",
  "payments.2.t": "USDT Crypto", "payments.2.d": "TRC20 or ERC20 USDT transfer accepted.",
  "payments.3.t": "Cash via Courier", "payments.3.d": "Bolt courier cash pickup — by arrangement.",
  "payments.4.t": "Russian Cards", "payments.4.d": "Payment in rubles to Russian bank cards.",
  "payments.5.t": "SWIFT Transfer", "payments.5.d": "International bank wire transfer available.",

  "guides.title": "Latest Airport & Travel Guides",
  "guides.subtitle": "Expert tips and practical guides for your Phuket trip.",
  "guides.1.t": "Arrival Guide 2026", "guides.1.d": "Complete guide to arriving at Phuket Airport.",
  "guides.2.t": "What Is Fast Track?", "guides.2.d": "How VIP airport fast track works, what's included.",
  "guides.3.t": "Entry Requirements", "guides.3.d": "Everything you need to enter Thailand in 2026 — visa, TDAC, etc.",
  
  "faq.title": "Frequently Asked Questions",
  "faq.1.q": "How fast is the process?", "faq.1.a": "Under 5 minutes compared to standard waits of over 60 minutes.",
  "faq.2.q": "How will I find my concierge?", "faq.2.a": "At the aircraft bridge (Arrival) or Terminal entrance (Departure) holding a sign.",
  "faq.3.q": "Do you help with Thai forms?", "faq.3.a": "Yes, our team assists you in filling out all mandatory entry forms.",

  "footer.legal": "© 2015-2026 Phuket Airport Fast Track. All rights reserved.",
  "modal.close": "Close Window"
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
        if isinstance(v, str):
            lang_dict[k] = translate_text(v, lang)
            time.sleep(0.1) # Be nice to Google
        else:
            lang_dict[k] = v
    # Save mapping properly
    filename = 'zh.json' if lang == 'zh-CN' else f"{lang}.json"
    with open(f'src/locales/{filename}', 'w', encoding='utf-8') as f:
        json.dump(lang_dict, f, ensure_ascii=False, indent=2)
print("All languages generated successfully!")
