import urllib.request
import urllib.parse
import json
import time
import os

with open('src/locales/en.json', 'r', encoding='utf-8') as f:
    en_dict = json.load(f)

languages = ['he', 'ar', 'es', 'fr', 'de', 'it']

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
            time.sleep(0.1)
        else:
            lang_dict[k] = v
    with open(f'src/locales/{lang}.json', 'w', encoding='utf-8') as f:
        json.dump(lang_dict, f, ensure_ascii=False, indent=2)
print("Missing languages generated successfully!")
