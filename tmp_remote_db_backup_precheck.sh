set -e
which mysqldump >/dev/null 2>&1 && echo HAS_MYSQLDUMP || echo NO_MYSQLDUMP
which gzip >/dev/null 2>&1 && echo HAS_GZIP || echo NO_GZIP
[ -d /opt/robodynamics/docs ] && echo HAS_DOCS_DIR || echo NO_DOCS_DIR
ls -ld /opt/robodynamics/docs || true
