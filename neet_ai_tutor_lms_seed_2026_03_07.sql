-- NEET AI Tutor LMS seed (sessions + offerings + optional enrollments)
-- Generated on 2026-03-07
-- Source for unit headings: National Medical Commission (NEET UG syllabus PDF)
-- https://www.nmc.org.in/MCIRest/open/getDocument?path=/Documents/Public/Portal/LatestNews/neetUGsyllabus2026.pdf

-- ---------------------------
-- 1) Configure course IDs
-- ---------------------------
SET @physics_course_id := 138;
SET @chemistry_course_id := 131;
SET @biology_course_id := 132;

-- Optional: set these to enroll a student in active AI Tutor offerings.
SET @student_user_id := NULL; -- Example: 347
SET @parent_user_id  := NULL; -- Example: 120

DROP TEMPORARY TABLE IF EXISTS tmp_neet_units;
CREATE TEMPORARY TABLE tmp_neet_units (
  module_code VARCHAR(32) NOT NULL,
  course_id INT NOT NULL,
  unit_no INT NOT NULL,
  unit_title VARCHAR(255) NOT NULL,
  unit_desc VARCHAR(1000) NULL
);

INSERT INTO tmp_neet_units (module_code, course_id, unit_no, unit_title, unit_desc) VALUES
-- NEET Physics (20 units)
('NEET_PHYSICS',   @physics_course_id,  1, 'Physics and Measurement', 'Units, dimensions, errors, and significant figures.'),
('NEET_PHYSICS',   @physics_course_id,  2, 'Kinematics', 'Motion in one and two dimensions, relative motion, vectors.'),
('NEET_PHYSICS',   @physics_course_id,  3, 'Laws of Motion', 'Newton''s laws, friction, dynamics of connected systems.'),
('NEET_PHYSICS',   @physics_course_id,  4, 'Work, Energy and Power', 'Work-energy theorem, conservation laws, power.'),
('NEET_PHYSICS',   @physics_course_id,  5, 'Rotational Motion', 'Torque, angular momentum, rolling, moments of inertia.'),
('NEET_PHYSICS',   @physics_course_id,  6, 'Gravitation', 'Universal gravitation, satellites, escape velocity.'),
('NEET_PHYSICS',   @physics_course_id,  7, 'Properties of Solids and Liquids', 'Elasticity, viscosity, surface tension, fluid flow.'),
('NEET_PHYSICS',   @physics_course_id,  8, 'Thermodynamics', 'Laws of thermodynamics, heat transfer, engines.'),
('NEET_PHYSICS',   @physics_course_id,  9, 'Kinetic Theory of Gases', 'Gas laws, molecular interpretation, mean free path.'),
('NEET_PHYSICS',   @physics_course_id, 10, 'Oscillations and Waves', 'SHM, wave motion, sound, Doppler effect basics.'),
('NEET_PHYSICS',   @physics_course_id, 11, 'Electrostatics', 'Electric field, potential, capacitors.'),
('NEET_PHYSICS',   @physics_course_id, 12, 'Current Electricity', 'Ohm''s law, circuits, Kirchhoff laws, meters.'),
('NEET_PHYSICS',   @physics_course_id, 13, 'Magnetic Effects of Current and Magnetism', 'Force on charges, Biot-Savart, Ampere, magnetic materials.'),
('NEET_PHYSICS',   @physics_course_id, 14, 'Electromagnetic Induction and Alternating Currents', 'Faraday law, LCR circuits, AC power.'),
('NEET_PHYSICS',   @physics_course_id, 15, 'Electromagnetic Waves', 'Nature, spectrum, propagation.'),
('NEET_PHYSICS',   @physics_course_id, 16, 'Optics', 'Ray optics, wave optics, optical instruments.'),
('NEET_PHYSICS',   @physics_course_id, 17, 'Dual Nature of Matter and Radiation', 'Photoelectric effect, de Broglie hypothesis.'),
('NEET_PHYSICS',   @physics_course_id, 18, 'Atoms and Nuclei', 'Atomic models, radioactivity, nuclear energy.'),
('NEET_PHYSICS',   @physics_course_id, 19, 'Electronic Devices', 'Semiconductors, diodes, transistors, logic gates.'),
('NEET_PHYSICS',   @physics_course_id, 20, 'Experimental Skills', 'Lab skills, instrumentation, graph/data interpretation.'),

-- NEET Chemistry (20 units)
('NEET_CHEMISTRY', @chemistry_course_id,  1, 'Some Basic Concepts in Chemistry', 'Mole concept, stoichiometry, concentration terms.'),
('NEET_CHEMISTRY', @chemistry_course_id,  2, 'Atomic Structure', 'Quantum model, electronic configuration, spectra.'),
('NEET_CHEMISTRY', @chemistry_course_id,  3, 'Chemical Bonding and Molecular Structure', 'Bond parameters, hybridization, VSEPR, MOT.'),
('NEET_CHEMISTRY', @chemistry_course_id,  4, 'Chemical Thermodynamics', 'Enthalpy, entropy, Gibbs free energy.'),
('NEET_CHEMISTRY', @chemistry_course_id,  5, 'Solutions', 'Colligative properties and concentration relations.'),
('NEET_CHEMISTRY', @chemistry_course_id,  6, 'Equilibrium', 'Chemical and ionic equilibrium, pH, buffers.'),
('NEET_CHEMISTRY', @chemistry_course_id,  7, 'Redox Reactions and Electrochemistry', 'Redox balancing, cells, Nernst equation.'),
('NEET_CHEMISTRY', @chemistry_course_id,  8, 'Chemical Kinetics', 'Rate laws, order, Arrhenius equation.'),
('NEET_CHEMISTRY', @chemistry_course_id,  9, 'Classification of Elements and Periodicity in Properties', 'Periodic trends and modern periodic table.'),
('NEET_CHEMISTRY', @chemistry_course_id, 10, 'P-Block Elements', 'Properties and compounds of representative elements.'),
('NEET_CHEMISTRY', @chemistry_course_id, 11, 'd- and f- Block Elements', 'Transition elements and inner transition elements.'),
('NEET_CHEMISTRY', @chemistry_course_id, 12, 'Coordination Compounds', 'Ligands, nomenclature, bonding and isomerism.'),
('NEET_CHEMISTRY', @chemistry_course_id, 13, 'Purification and Characterisation of Organic Compounds', 'Purification, qualitative analysis, detection tests.'),
('NEET_CHEMISTRY', @chemistry_course_id, 14, 'Some Basic Principles of Organic Chemistry', 'GOC, reaction intermediates, mechanisms.'),
('NEET_CHEMISTRY', @chemistry_course_id, 15, 'Hydrocarbons', 'Alkanes, alkenes, alkynes, aromatic compounds.'),
('NEET_CHEMISTRY', @chemistry_course_id, 16, 'Organic Compounds Containing Halogens', 'Haloalkanes and haloarenes.'),
('NEET_CHEMISTRY', @chemistry_course_id, 17, 'Organic Compounds Containing Oxygen', 'Alcohols, phenols, ethers, carbonyl compounds.'),
('NEET_CHEMISTRY', @chemistry_course_id, 18, 'Organic Compounds Containing Nitrogen', 'Amines, diazonium salts, biomolecule links.'),
('NEET_CHEMISTRY', @chemistry_course_id, 19, 'Biomolecules', 'Carbohydrates, proteins, nucleic acids, vitamins.'),
('NEET_CHEMISTRY', @chemistry_course_id, 20, 'Principles Related to Practical Chemistry', 'Lab techniques, tests, and practical inference.'),

-- NEET Biology (10 units)
('NEET_BIOLOGY',   @biology_course_id,  1, 'Diversity in Living World', 'Classification, nomenclature, and biodiversity.'),
('NEET_BIOLOGY',   @biology_course_id,  2, 'Structural Organisation in Animals and Plants', 'Tissues, morphology, anatomy, and organization.'),
('NEET_BIOLOGY',   @biology_course_id,  3, 'Cell Structure and Function', 'Cell theory, biomolecules, division, and cycle.'),
('NEET_BIOLOGY',   @biology_course_id,  4, 'Plant Physiology', 'Transport, photosynthesis, respiration, growth.'),
('NEET_BIOLOGY',   @biology_course_id,  5, 'Human Physiology', 'Body systems, neural and hormonal coordination.'),
('NEET_BIOLOGY',   @biology_course_id,  6, 'Reproduction', 'Reproductive biology and developmental processes.'),
('NEET_BIOLOGY',   @biology_course_id,  7, 'Genetics and Evolution', 'Mendelian genetics, molecular basis, evolution.'),
('NEET_BIOLOGY',   @biology_course_id,  8, 'Biology and Human Welfare', 'Health, disease, microbes in welfare.'),
('NEET_BIOLOGY',   @biology_course_id,  9, 'Biotechnology and Its Applications', 'Principles, tools, and applications of biotech.'),
('NEET_BIOLOGY',   @biology_course_id, 10, 'Ecology and Environment', 'Ecosystems, biodiversity, and conservation.');

-- ---------------------------
-- 2) Ensure active offerings
-- ---------------------------
INSERT INTO rd_course_offerings (
  start_date, end_date, course_offering_name, fee_amount, reminder_needed, is_active,
  course_id, sessions_per_week, days_of_week
)
SELECT
  CURDATE(),
  DATE_ADD(CURDATE(), INTERVAL 365 DAY),
  CONCAT(c.course_name, ' - AI Tutor Offering'),
  0.0,
  0,
  1,
  c.course_id,
  0,
  ''
FROM (
  SELECT DISTINCT course_id FROM tmp_neet_units
) n
JOIN rd_courses c ON c.course_id = n.course_id
LEFT JOIN rd_course_offerings o
  ON o.course_id = c.course_id
 AND o.is_active = 1
 AND o.course_offering_name = CONCAT(c.course_name, ' - AI Tutor Offering')
WHERE o.course_offering_id IS NULL;

DROP TEMPORARY TABLE IF EXISTS tmp_neet_offerings;
CREATE TEMPORARY TABLE tmp_neet_offerings AS
SELECT
  o.course_id,
  MAX(o.course_offering_id) AS course_offering_id
FROM rd_course_offerings o
JOIN (
  SELECT DISTINCT course_id FROM tmp_neet_units
) n ON n.course_id = o.course_id
WHERE o.is_active = 1
GROUP BY o.course_id;

-- ---------------------------
-- 3) Optional enrollment seed
-- ---------------------------
INSERT INTO rd_student_enrollments (
  course_offering_id, student_id, parent_id, enrollment_date,
  discount_percent, discount_reason, final_fee, status, progress
)
SELECT
  o.course_offering_id,
  @student_user_id,
  @parent_user_id,
  NOW(),
  0,
  'AI Tutor NEET seed',
  0,
  1,
  0
FROM tmp_neet_offerings o
WHERE @student_user_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1
    FROM rd_student_enrollments e
    WHERE e.course_offering_id = o.course_offering_id
      AND e.student_id = @student_user_id
      AND e.status = 1
  );

-- ---------------------------
-- 4) Seed chapter sessions
-- ---------------------------
INSERT INTO rd_course_sessions (
  session_id, course_id, parent_session_id, session_type,
  tier_level, tier_order, session_title, creation_date, version, progress, grade, session_description
)
SELECT
  COALESCE(mx.max_session_id, 0)
    + ROW_NUMBER() OVER (PARTITION BY u.course_id ORDER BY u.unit_no) AS session_id,
  u.course_id,
  NULL AS parent_session_id,
  'session' AS session_type,
  NULL AS tier_level,
  u.unit_no AS tier_order,
  CONCAT('Unit ', LPAD(u.unit_no, 2, '0'), ': ', u.unit_title) AS session_title,
  NOW() AS creation_date,
  1 AS version,
  0 AS progress,
  '11-12' AS grade,
  u.unit_desc AS session_description
FROM tmp_neet_units u
LEFT JOIN (
  SELECT course_id, MAX(session_id) AS max_session_id
  FROM rd_course_sessions
  GROUP BY course_id
) mx ON mx.course_id = u.course_id
LEFT JOIN rd_course_sessions ex
  ON ex.course_id = u.course_id
 AND ex.session_title = CONCAT('Unit ', LPAD(u.unit_no, 2, '0'), ': ', u.unit_title)
WHERE ex.course_session_id IS NULL;

-- Keep descriptions current for any pre-existing title-matched rows.
UPDATE rd_course_sessions cs
JOIN tmp_neet_units u
  ON u.course_id = cs.course_id
 AND cs.session_title = CONCAT('Unit ', LPAD(u.unit_no, 2, '0'), ': ', u.unit_title)
SET
  cs.session_type = 'session',
  cs.tier_order = u.unit_no,
  cs.session_description = u.unit_desc,
  cs.grade = COALESCE(NULLIF(cs.grade, ''), '11-12'),
  cs.version = GREATEST(COALESCE(cs.version, 0), 1),
  cs.creation_date = COALESCE(cs.creation_date, NOW());

-- ---------------------------
-- 5) Verification snapshot
-- ---------------------------
SELECT 'SEEDED_OFFERS' AS tag, o.course_id, o.course_offering_id
FROM tmp_neet_offerings o
ORDER BY o.course_id;

SELECT
  'SEEDED_SESSIONS' AS tag,
  cs.course_id,
  COUNT(*) AS session_count
FROM rd_course_sessions cs
JOIN (
  SELECT DISTINCT course_id FROM tmp_neet_units
) n ON n.course_id = cs.course_id
WHERE cs.session_type = 'session'
GROUP BY cs.course_id
ORDER BY cs.course_id;

DROP TEMPORARY TABLE IF EXISTS tmp_neet_offerings;
DROP TEMPORARY TABLE IF EXISTS tmp_neet_units;
