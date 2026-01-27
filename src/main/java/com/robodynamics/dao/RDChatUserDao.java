package com.robodynamics.dao;

import java.util.List;
import com.robodynamics.model.RDUser;

public interface RDChatUserDao {

    List<RDUser> findChatEligibleUsers(Integer currentUserId);

}
