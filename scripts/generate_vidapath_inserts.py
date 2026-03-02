import csv, pathlib
base = pathlib.Path('docs')
qcsv = base / 'question_bank_career_discovery.csv'
fcsv = base / 'future_careers.csv'
out = base / 'VIDAPATH_DB_INSERTS.sql'

def escape(val):
    if val is None:
        return 'NULL'
    s = val.replace("'", "''")
    return f"'{s}'"

with out.open('w', encoding='utf-8') as f:
    f.write('-- Inserts for VidaPath tables generated via script\n')
    f.write('DELETE FROM vida_path_question_bank;\n')
    with qcsv.open(encoding='utf-8') as qc:
        reader = csv.reader(qc)
        next(reader)
        for row in reader:
            if not any(cell.strip() for cell in row):
                continue
            vals = [escape(cell.strip()) if cell.strip() else 'NULL' for cell in row[:6]]
            f.write('INSERT INTO vida_path_question_bank (section, question_id, question_text, question_type, tags, adaptivity_notes) VALUES (')
            f.write(', '.join(vals))
            f.write(');\n')
    f.write('\nDELETE FROM vida_path_future_career;\n')
    with fcsv.open(encoding='utf-8') as fc:
        reader = csv.reader(fc)
        next(reader)
        for row in reader:
            if not any(cell.strip() for cell in row):
                continue
            vals = [escape(cell.strip()) if cell.strip() else 'NULL' for cell in row[:7]]
            f.write('INSERT INTO vida_path_future_career (career_cluster, career_name, description, required_skills, projected_growth_india, projected_growth_global, relevant_grades) VALUES (')
            f.write(', '.join(vals))
            f.write(');\n')
