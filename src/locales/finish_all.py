import urllib.request
import urllib.parse
import json
import time

with open('src/locales/en.json', 'r', encoding='utf-8') as f:
    en_dict = json.load(f)

# Languages likely incomplete: fr, de, it
languages = ['fr', 'de', 'it']

def translate_text(text, target_lang):
    if not text: return ""
    try:
        url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=" + target_lang + "&dt=t&q=" + urllib.parse.quote(text)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        return ''.join([sentence[0] for sentence in data[0] if sentence[0]])
    except Exception as e:
        return text

for lang in languages:
    new_dict = {}
    for k, v in en_dict.items():
        new_dict[k] = translate_text(v, lang)
    with open(f'src/locales/{lang}.json', 'w', encoding='utf-8') as f:
        json.dump(new_dict, f, ensure_ascii=False, indent=2)
print("Finished!")
