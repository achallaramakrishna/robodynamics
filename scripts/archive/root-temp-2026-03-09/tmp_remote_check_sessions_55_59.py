import re, urllib.request, urllib.parse, http.cookiejar
BASE='http://127.0.0.1:8080'
CHECK=[('8','sashank_1','sashank_1','55'),('9','sashank','sashank','56'),('10','ridhianish','ridhianish','57'),('11','krishvi','krishvi','58'),('12','student01','student01','59')]
for g,u,p,sid in CHECK:
    cj=http.cookiejar.CookieJar()
    op=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    def req(path,data=None):
        body=None
        if data is not None:
            body=urllib.parse.urlencode(data).encode('utf-8')
        r=urllib.request.Request(BASE+path,data=body)
        with op.open(r,timeout=60) as resp:
            return resp.read().decode('utf-8','replace')
    req('/login'); req('/login',{'userName':u,'password':p})
    html=req('/aptipath/student/result?sessionId='+sid)
    titles=[t.strip() for t in re.findall(r'<div class="title">\s*([^<]+?)\s*</div>', html)]
    cues=[c.strip() for c in re.findall(r'Intent cues:\s*([^.<]+)', html)]
    cues_unique=[]
    for c in cues:
        if c not in cues_unique:
            cues_unique.append(c)
    print('GRADE',g,'SESSION',sid)
    print('TOP7', ' | '.join(titles[:7]))
    print('CUES', ' | '.join(cues_unique[:5]))
    print('HAS_GENERAL_EXPLORATION', 'General Exploration' in ' '.join(cues_unique))
    print('HAS_AI_ML_ENGINEER', any('AI/ML Engineer' in t for t in titles))
    print('---')
