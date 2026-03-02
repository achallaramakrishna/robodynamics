set -e
cp -f /tmp/question_bank_career_discovery.csv /var/lib/mysql-files/question_bank_career_discovery.csv
cp -f /tmp/future_careers.csv /var/lib/mysql-files/future_careers.csv
chown mysql:mysql /var/lib/mysql-files/question_bank_career_discovery.csv /var/lib/mysql-files/future_careers.csv
chmod 644 /var/lib/mysql-files/question_bank_career_discovery.csv /var/lib/mysql-files/future_careers.csv
ls -l /var/lib/mysql-files/question_bank_career_discovery.csv /var/lib/mysql-files/future_careers.csv
