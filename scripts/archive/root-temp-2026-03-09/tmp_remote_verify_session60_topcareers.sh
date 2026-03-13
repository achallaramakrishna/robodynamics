set -e
mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s <<'SQL'
SELECT
  COALESCE(JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.topCareerMatches[0].careerName')),''),
  COALESCE(JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.topCareerMatches[1].careerName')),''),
  COALESCE(JSON_UNQUOTE(JSON_EXTRACT(career_clusters_json,'$.topCareerMatches[2].careerName')),'')
FROM rd_ci_recommendation_snapshot
WHERE ci_assessment_session_id = 60
ORDER BY ci_recommendation_snapshot_id DESC
LIMIT 1;
SQL
python3 - <<'PY'
import re, urllib.request, urllib.parse, http.cookiejar
BASE='http://127.0.0.1:8080'; USER='sashank_1'; PWD='sashank_1'; SID='60'
cj=http.cookiejar.CookieJar(); op=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
def req(path,data=None):
    body=None
    if data is not None:
        body=urllib.parse.urlencode(data).encode('utf-8')
    r=urllib.request.Request(BASE+path,data=body)
    with op.open(r,timeout=40) as resp:
        return resp.read().decode('utf-8','replace')
req('/login'); req('/login',{'userName':USER,'password':PWD})
html=req('/aptipath/student/result?sessionId='+SID)
names=[n.strip() for n in re.findall(r'<div class="title">\s*([^<]+?)\s*</div>', html)]
print('RESULT_TOP_1', names[0] if len(names)>0 else '')
print('RESULT_TOP_2', names[1] if len(names)>1 else '')
print('RESULT_TOP_3', names[2] if len(names)>2 else '')
print('RESULT_TOTAL_TITLES', len(names))
PY
