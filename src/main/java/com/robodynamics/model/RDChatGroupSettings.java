package com.robodynamics.model;

import javax.persistence.*;

@Entity
@Table(name = "rd_chat_group_settings")
public class RDChatGroupSettings {

    @Id
    @Column(name = "conversation_id")
    private Long conversationId;

    @Column(name = "only_admin_can_message", nullable = false)
    private boolean onlyAdminCanMessage;

    @Column(name = "allow_member_add", nullable = false)
    private boolean allowMemberAdd;

    /* ========= GETTERS & SETTERS ========= */

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }

    public boolean isOnlyAdminCanMessage() {
        return onlyAdminCanMessage;
    }

    public void setOnlyAdminCanMessage(boolean onlyAdminCanMessage) {
        this.onlyAdminCanMessage = onlyAdminCanMessage;
    }

    public boolean isAllowMemberAdd() {
        return allowMemberAdd;
    }

    public void setAllowMemberAdd(boolean allowMemberAdd) {
        this.allowMemberAdd = allowMemberAdd;
    }
}
