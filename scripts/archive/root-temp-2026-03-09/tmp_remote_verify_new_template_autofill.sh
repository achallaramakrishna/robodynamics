#!/bin/bash
set -e
SID=68
VERIFY_CODE='AP3_CAR_VERIFY_2999'
VERIFY_NAME='Structured Template Verification Career'

SNAP_ID=$(mysql -uroot -p'Jatni@752050' -D robodynamics_db -N -s -e "SELECT ci_recommendation_snapshot_id FROM rd_ci_recommendation_snapshot WHERE ci_assessment_session_id=$SID ORDER BY ci_recommendation_snapshot_id DESC LIMIT 1;")
echo "SNAP_ID=$SNAP_ID"

mysql -uroot -p'Jatni@752050' -D robodynamics_db -e "
UPDATE rd_ci_recommendation_snapshot
SET career_clusters_json = JSON_SET(
  career_clusters_json,
  '$.topCareerMatches[0].careerCode', '$VERIFY_CODE',
  '$.topCareerMatches[0].careerName', '$VERIFY_NAME',
  '$.topCareerMatches[0].cluster', 'Verification Cluster'
)
WHERE ci_recommendation_snapshot_id=$SNAP_ID;
"

echo "SNAPSHOT_UPDATED"

python3 - <<'PY'
import urllib.request, urllib.parse, urllib.error, http.cookiejar
BASE='http://127.0.0.1:8080'
USER='krishvi'; PWD='krishvi'; SID='68'
class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, hdrs, newurl):
        return None
cj=http.cookiejar.CookieJar()
op=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj), NoRedirect())
def req(path,data=None):
    url = path if path.startswith('http') else BASE+path
    body=None
    if data is not None:
        body=urllib.parse.urlencode(data).encode('utf-8')
    r=urllib.request.Request(url,data=body)
    try:
        resp=op.open(r,timeout=240)
        return resp.getcode(), resp.read().decode('utf-8','replace'), dict(resp.headers.items())
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode('utf-8','replace'), dict(e.headers.items())
req('/login')
req('/login',{'userName':USER,'password':PWD})
c,b,h=req('/aptipath/student/result?sessionId='+SID)
if c in (302,303) and h.get('Location'):
    c,b,h=req(h['Location'])
print('RESULT_STATUS', c)
PY

echo "--- GENERATED ROWS FOR VERIFY CODE ---"
mysql -uroot -p'Jatni@752050' -D robodynamics_db -t <<'SQL'
SELECT plan_tier, grade_stage, section_type, item_order,
       CASE WHEN metadata_json LIKE '%OPENAI_AUTOFILL%' THEN 'OPENAI_AUTOFILL' ELSE 'OTHER' END AS source,
       created_at
FROM rd_ci_career_roadmap
WHERE module_code='APTIPATH' AND assessment_version='v3' AND career_code='AP3_CAR_VERIFY_2999'
ORDER BY ci_career_roadmap_id DESC;
SQL

echo "--- COVERAGE CHECK ---"
mysql -uroot -p'Jatni@752050' -D robodynamics_db -t <<'SQL'
SELECT plan_tier,
       SUM(section_type='OVERVIEW') AS overview,
       SUM(section_type='WHAT_TO_STUDY') AS what_to_study,
       SUM(section_type='SKILLS') AS skills,
       SUM(section_type='PROJECTS') AS projects,
       SUM(section_type='WHERE_TO_STUDY') AS where_to_study,
       SUM(section_type='ACTION_90') AS action_90,
       SUM(section_type='MILESTONE') AS milestone,
       SUM(section_type='UPGRADE') AS upgrade_rows,
       COUNT(*) AS total_rows
FROM rd_ci_career_roadmap
WHERE module_code='APTIPATH' AND assessment_version='v3' AND career_code='AP3_CAR_VERIFY_2999'
GROUP BY plan_tier;
SQL
