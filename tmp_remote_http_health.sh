for u in \
  'https://robodynamics.in/' \
  'https://robodynamics.in/registerParentChild?plan=career-basic&redirect=%2Fplans%2Fcheckout%3Fplan%3Dcareer-basic' \
  'https://robodynamics.in/plans/checkout?plan=career-basic'; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$u")
  echo "$code $u"
done
