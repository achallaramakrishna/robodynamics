set -euo pipefail
WEB=/opt/robodynamics/ai-tutor/web/app
LIB=/opt/robodynamics/ai-tutor/web/lib
install -D -m 644 /tmp/ms_appSession.ts \/appSession.ts
install -D -m 644 /tmp/ms_mindsutraCatalog.ts \/mindsutraCatalog.ts
install -D -m 644 /tmp/ms_api_auth_login.ts \/api/auth/login/route.ts
install -D -m 644 /tmp/ms_api_auth_register.ts \/api/auth/register/route.ts
install -D -m 644 /tmp/ms_api_student_home.ts \/api/student/home/route.ts
install -D -m 644 /tmp/ms_api_parent_dashboard.ts \/api/parent/dashboard/route.ts
install -D -m 644 /tmp/ms_api_payment_verify.ts \/api/payment/verify/route.ts
install -D -m 644 /tmp/ms_checkout_success.tsx \/checkout/success/page.tsx
install -D -m 644 /tmp/ms_checkout_grade.tsx "\/checkout/[grade]/page.tsx"
install -D -m 644 /tmp/ms_student_home_client.tsx \/student/home/StudentHomeClient.tsx
install -D -m 644 /tmp/ms_student_course_page.tsx "\/student/course/[grade]/page.tsx"
install -D -m 644 /tmp/ms_student_course_client.tsx "\/student/course/[grade]/StudentCourseHubClient.tsx"
find /opt/robodynamics/ai-tutor/web/app/ai-tutor/tutor -maxdepth 1 -type f \( -name 'TutorClient*.backup*.tsx' -o -name 'TutorClient*.localbackup*.tsx' -o -name 'TutorClient*.corrupt*.tsx' -o -name 'TutorClient.prodbackup*.tsx' \) -delete
find /opt/robodynamics/ai-tutor/web/app/ai-tutor/vedic -maxdepth 1 -type f \( -name 'VedicTutorClient*.tsx' -o -name '*.backup*.tsx' -o -name '*.localbackup*.tsx' -o -name '*.corrupt*.tsx' \) -delete
cd /opt/robodynamics/ai-tutor/web
npm run build >/tmp/rd_ai_tutor_web_build_p0.log 2>&1 || (tail -n 120 /tmp/rd_ai_tutor_web_build_p0.log; exit 1)
cp -r /opt/robodynamics/ai-tutor/web/public /opt/robodynamics/ai-tutor/web/.next/standalone/
cp -r /opt/robodynamics/ai-tutor/web/.next/static /opt/robodynamics/ai-tutor/web/.next/standalone/.next/
systemctl restart rd-ai-tutor-web
sleep 3
echo "WEB=$(systemctl is-active rd-ai-tutor-web)"
curl -ksS -D - -o /dev/null https://robodynamics.in/student/home | head -n 20
curl -ksS -D - -o /dev/null https://robodynamics.in/student/course/grade-5 | head -n 20
curl -ksS -D - -o /dev/null https://robodynamics.in/parent/dashboard | head -n 20
