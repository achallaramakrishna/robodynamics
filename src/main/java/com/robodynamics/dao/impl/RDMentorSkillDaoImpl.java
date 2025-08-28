package com.robodynamics.dao.impl;

import com.robodynamics.dao.RDMentorSkillDao;
import com.robodynamics.model.RDMentorSkill;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

@Repository
@Transactional
public class RDMentorSkillDaoImpl implements RDMentorSkillDao {

  @Resource private SessionFactory sessionFactory;

  @Override
  public List<RDMentorSkill> findByMentorId(int mentorId) {
    Session s = sessionFactory.getCurrentSession();
    return s.createQuery(
        "from RDMentorSkill ms where ms.mentor.mentorId = :mid order by ms.subjectCode",
        RDMentorSkill.class)
      .setParameter("mid", mentorId)
      .getResultList();
  }

  @Override
  public void deleteAllForMentor(int mentorId) {
    Session s = sessionFactory.getCurrentSession();
    s.createQuery("delete from RDMentorSkill ms where ms.mentor.mentorId = :mid")
      .setParameter("mid", mentorId)
      .executeUpdate();
  }

  @Override
  public void saveAll(Iterable<RDMentorSkill> skills) {
    Session s = sessionFactory.getCurrentSession();
    for (RDMentorSkill sk : skills) s.save(sk);
  }
}
