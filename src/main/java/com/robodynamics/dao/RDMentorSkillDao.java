package com.robodynamics.dao;

import com.robodynamics.model.RDMentorSkill;
import java.util.List;

public interface RDMentorSkillDao {
  List<RDMentorSkill> findByMentorId(int mentorId);
  void deleteAllForMentor(int mentorId);
  void saveAll(Iterable<RDMentorSkill> skills);
}
