from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.moneymind_db import get_db, MMUser, MMBankAccount, MMTransaction, MMSavingGoal, MMProgress
from pydantic import BaseModel
from typing import List
import random
import os
import hmac
import hashlib
from datetime import datetime

router = APIRouter(prefix="/ai-tutor-api/moneymind", tags=["MoneyMind"])

# --- Request/Response Models ---

class WalletInfo(BaseModel):
    user_id: int
    username: str
    balance: float

class TransactionCreate(BaseModel):
    user_id: int
    account_id: int
    amount: float
    description: str

class AccountCreate(BaseModel):
    user_id: int
    account_type: str

# --- Routes ---

@router.get("/wallet/{user_id}", response_model=WalletInfo)
def get_wallet(user_id: int, db: Session = Depends(get_db)):
    user = db.query(MMUser).filter(MMUser.user_id == user_id).first()
    if not user:
        # For demo purposes, auto-create user
        user = MMUser(user_id=user_id, username=f"Kid_{user_id}", virtual_balance=1000.0)
        db.add(user)
        db.commit()
        db.refresh(user)
    return WalletInfo(user_id=user.user_id, username=user.username, balance=user.virtual_balance)

@router.post("/bank/account/create")
def create_account(payload: AccountCreate, db: Session = Depends(get_db)):
    # Generate random 10 digit account number
    acc_num = "".join([str(random.randint(0, 9)) for _ in range(10)])
    new_acc = MMBankAccount(
        user_id=payload.user_id,
        account_number=acc_num,
        balance=0.0,
        account_type=payload.account_type
    )
    db.add(new_acc)
    db.commit()
    db.refresh(new_acc)
    return new_acc

@router.post("/atm/withdraw")
def atm_withdraw(payload: TransactionCreate, db: Session = Depends(get_db)):
    account = db.query(MMBankAccount).filter(MMBankAccount.id == payload.account_id).first()
    if not account or account.balance < payload.amount:
        raise HTTPException(status_code=400, detail="Insufficient funds in bank account")
    
    # 1. Deduct from Bank Account
    account.balance -= payload.amount
    
    # 2. Add to User's Virtual Wallet (Cash in pocket)
    user = db.query(MMUser).filter(MMUser.user_id == account.user_id).first()
    user.virtual_balance += payload.amount
    
    # 3. Record Transaction
    txn = MMTransaction(
        account_id=account.id,
        transaction_type="DEBIT",
        amount=payload.amount,
        description=f"ATM Withdrawal: {payload.description}"
    )
    db.add(txn)
    db.commit()
    return {"status": "success", "new_balance": account.balance, "wallet_balance": user.virtual_balance}

@router.post("/bank/deposit")
def bank_deposit(payload: TransactionCreate, db: Session = Depends(get_db)):
    user = db.query(MMUser).filter(MMUser.user_id == payload.user_id).first()
    if not user or user.virtual_balance < payload.amount:
        raise HTTPException(status_code=400, detail="Insufficient cash in pocket")
    
    account = db.query(MMBankAccount).filter(MMBankAccount.id == payload.account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    # 1. Deduct from Wallet
    user.virtual_balance -= payload.amount

    # 2. Add to Bank Account
    account.balance += payload.amount

    # 3. Record Transaction
    txn = MMTransaction(
        account_id=account.id,
        transaction_type="CREDIT",
        amount=payload.amount,
        description=f"Cash Deposit: {payload.description}"
    )
    db.add(txn)
    db.commit()
    return {"status": "success", "new_balance": account.balance, "wallet_balance": user.virtual_balance}

@router.get("/bank/accounts/{user_id}")
def get_accounts(user_id: int, db: Session = Depends(get_db)):
    return db.query(MMBankAccount).filter(MMBankAccount.user_id == user_id).all()


@router.get("/bank/transactions/{account_id}")
def get_transactions(account_id: int, db: Session = Depends(get_db)):
    return db.query(MMTransaction).filter(MMTransaction.account_id == account_id).order_by(MMTransaction.timestamp.desc()).all()

# --- UPI Routes ---

class UpiPayment(BaseModel):
    user_id: int
    vpa: str
    amount: float
    pin: str # Simplified UPI PIN for kids

@router.get("/merchants")
def get_merchants(db: Session = Depends(get_db)):
    from app.services.moneymind_db import MMMerchant
    return db.query(MMMerchant).all()

@router.post("/upi/pay")
def upi_pay(payload: UpiPayment, db: Session = Depends(get_db)):
    from app.services.moneymind_db import MMMerchant
    # 1. Verify User Wallet (Cash in pocket isn't used for UPI, usually it's from Bank)
    # But for kids, we might want to simulate paying from a virtual 'Wallet' app.
    # In India, UPI is usually linked to a Bank Account.
    
    user = db.query(MMUser).filter(MMUser.user_id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    merchant = db.query(MMMerchant).filter(MMMerchant.vpa == payload.vpa).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant not found or invalid QR")

    if payload.pin != "9999": # Demo UPI PIN
        raise HTTPException(status_code=400, detail="INVALID UPI PIN")

    # For this simulation, we'll deduct from the user's primary bank account
    account = db.query(MMBankAccount).filter(MMBankAccount.user_id == payload.user_id).first()
    if not account or account.balance < payload.amount:
        raise HTTPException(status_code=400, detail="Insufficient Bank Balance for UPI")

    # Transaction
    account.balance -= payload.amount
    
    txn = MMTransaction(
        account_id=account.id,
        transaction_type="DEBIT",
        amount=payload.amount,
        description=f"UPI Payment to {merchant.name}"
    )
    db.add(txn)
    db.commit()
    

    return {
        "status": "success",
        "txnId": f"UPI{random.randint(100000, 999999)}",
        "new_balance": account.balance,
        "merchant": merchant.name
    }

# --- Savings Goal Routes ---

class GoalCreate(BaseModel):
    user_id: int
    goal_name: str
    target_amount: float

class GoalFund(BaseModel):
    user_id: int
    goal_id: int
    amount: float

@router.get("/goals/{user_id}")
def get_goals(user_id: int, db: Session = Depends(get_db)):
    return db.query(MMSavingGoal).filter(MMSavingGoal.user_id == user_id).all()

@router.post("/goal/create")
def create_goal(payload: GoalCreate, db: Session = Depends(get_db)):
    new_goal = MMSavingGoal(
        user_id=payload.user_id,
        goal_name=payload.goal_name,
        target_amount=payload.target_amount,
        current_amount=0.0
    )
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return new_goal

@router.post("/goal/add_funds")
def add_funds(payload: GoalFund, db: Session = Depends(get_db)):
    goal = db.query(MMSavingGoal).filter(MMSavingGoal.id == payload.goal_id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
        
    user = db.query(MMUser).filter(MMUser.user_id == payload.user_id).first()
    if not user or user.virtual_balance < payload.amount:
        raise HTTPException(status_code=400, detail="Not enough cash in your pocket to save!")

    # 1. Deduct from pocket
    user.virtual_balance -= payload.amount
    
    # 2. Add to goal
    goal.current_amount += payload.amount
    
    db.commit()

    return {
        "status": "success",
        "current_amount": goal.current_amount,
        "wallet_balance": user.virtual_balance,
        "is_completed": goal.current_amount >= goal.target_amount
    }

# --- Parent Dashboard Routes ---

class ChoreCreate(BaseModel):
    user_id: int
    description: str
    reward_amount: float

@router.get("/parent/chores/{user_id}")
def get_chores(user_id: int, db: Session = Depends(get_db)):
    from app.services.moneymind_db import MMChore
    return db.query(MMChore).filter(MMChore.user_id == user_id).all()

@router.post("/parent/chore/create")
def create_chore(payload: ChoreCreate, db: Session = Depends(get_db)):
    from app.services.moneymind_db import MMChore
    new_chore = MMChore(
        user_id=payload.user_id,
        description=payload.description,
        reward_amount=payload.reward_amount,
        status="PENDING"
    )
    db.add(new_chore)
    db.commit()
    db.refresh(new_chore)
    return new_chore

@router.post("/parent/chore/approve/{chore_id}")
def approve_chore(chore_id: int, db: Session = Depends(get_db)):
    from app.services.moneymind_db import MMChore
    chore = db.query(MMChore).filter(MMChore.id == chore_id).first()
    if not chore or chore.status == "PAID":
        raise HTTPException(status_code=400, detail="Chore not found or already paid")
    
    # 1. Update status
    chore.status = "PAID"
    
    # 2. Reward User (Add to pocket/wallet)
    user = db.query(MMUser).filter(MMUser.user_id == chore.user_id).first()
    if user:
        user.virtual_balance += chore.reward_amount
        
    db.commit()
    return {"status": "success", "rewarded": chore.reward_amount, "new_balance": user.virtual_balance}

@router.get("/parent/activity/{user_id}")
def get_activity(user_id: int, db: Session = Depends(get_db)):
    # Combine transactions from all accounts for this user
    accounts = db.query(MMBankAccount).filter(MMBankAccount.user_id == user_id).all()
    acc_ids = [acc.id for acc in accounts]
    txns = db.query(MMTransaction).filter(MMTransaction.account_id.in_(acc_ids)).order_by(MMTransaction.timestamp.desc()).limit(10).all()
    return txns

# ─── Progress Routes ──────────────────────────────────────────────────────────

class LessonCompleteRequest(BaseModel):
    user_id: int
    level_id: str   # e.g. "L3"
    lesson_id: str  # e.g. "MM_L3_2"
    xp_earned: int = 0


@router.get("/progress/{user_id}")
def get_progress(user_id: int, db: Session = Depends(get_db)):
    """Return all completed lesson IDs for a user."""
    rows = db.query(MMProgress).filter(MMProgress.user_id == user_id).all()
    return [
        {
            "lesson_id": r.lesson_id,
            "level_id": r.level_id,
            "completed": r.completed,
            "xp_earned": r.xp_earned,
            "completed_at": r.completed_at.isoformat() if r.completed_at else None,
        }
        for r in rows
    ]


@router.get("/progress/{user_id}/level/{level_id}")
def get_level_progress(user_id: int, level_id: str, db: Session = Depends(get_db)):
    """Return progress for a specific level (used by course page)."""
    rows = db.query(MMProgress).filter(
        MMProgress.user_id == user_id,
        MMProgress.level_id == level_id.upper(),
    ).all()
    completed_ids = {r.lesson_id for r in rows if r.completed}
    total_xp = sum(r.xp_earned for r in rows)
    return {
        "user_id": user_id,
        "level_id": level_id.upper(),
        "completed_lesson_ids": list(completed_ids),
        "total_xp": total_xp,
    }


@router.post("/progress/complete")
def complete_lesson(req: LessonCompleteRequest, db: Session = Depends(get_db)):
    """Mark a lesson as completed and award XP to the user's wallet."""
    # Upsert progress row
    existing = db.query(MMProgress).filter(
        MMProgress.user_id == req.user_id,
        MMProgress.lesson_id == req.lesson_id,
    ).first()

    if existing and existing.completed:
        return {"status": "already_completed", "xp_earned": existing.xp_earned}

    if existing:
        existing.completed = True
        existing.xp_earned = req.xp_earned
        existing.completed_at = datetime.utcnow()
    else:
        db.add(MMProgress(
            user_id=req.user_id,
            level_id=req.level_id,
            lesson_id=req.lesson_id,
            completed=True,
            xp_earned=req.xp_earned,
            completed_at=datetime.utcnow(),
        ))

    # Award XP as virtual balance bonus (1 XP = ₹0.10 virtual reward)
    user = db.query(MMUser).filter(MMUser.user_id == req.user_id).first()
    if user and req.xp_earned > 0:
        user.virtual_balance += req.xp_earned * 0.10

    db.commit()
    return {"status": "completed", "xp_earned": req.xp_earned}


# ─── Checkout Routes ──────────────────────────────────────────────────────────
#
# Feature flag: MONEYMIND_CHECKOUT_ENABLED (env var)
# When disabled, both endpoints return 503.

CHECKOUT_ENABLED = os.getenv("MONEYMIND_CHECKOUT_ENABLED", "false").lower() == "true"
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "")

BUNDLE_PRICES = {
    "moneymind-6-levels": 599900,  # in paise (₹5,999)
}

class CheckoutOrderRequest(BaseModel):
    bundle: str
    amount: int          # in paise, sent from frontend as confirmation
    name: str
    email: str
    phone: str

class PaymentVerifyRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    bundle: str
    email: str


@router.post("/checkout/create-order")
def create_checkout_order(req: CheckoutOrderRequest):
    if not CHECKOUT_ENABLED:
        raise HTTPException(status_code=503, detail="Checkout is not enabled yet.")

    expected_amount = BUNDLE_PRICES.get(req.bundle)
    if not expected_amount:
        raise HTTPException(status_code=400, detail=f"Unknown bundle: {req.bundle}")

    if req.amount != expected_amount:
        raise HTTPException(status_code=400, detail="Amount mismatch. Please refresh and try again.")

    try:
        import razorpay  # type: ignore
        client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
        order = client.order.create({
            "amount": expected_amount,
            "currency": "INR",
            "receipt": f"mm_{req.bundle}_{req.email[:10]}",
            "notes": {
                "bundle": req.bundle,
                "customer_name": req.name,
                "customer_email": req.email,
            },
        })
        return {"order_id": order["id"]}
    except ImportError:
        raise HTTPException(status_code=500, detail="Razorpay SDK not installed. Run: pip install razorpay")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Order creation failed: {str(e)}")


@router.post("/checkout/verify-payment")
def verify_payment(req: PaymentVerifyRequest):
    if not CHECKOUT_ENABLED:
        raise HTTPException(status_code=503, detail="Checkout is not enabled yet.")

    # Verify Razorpay signature
    expected_sig = hmac.new(
        RAZORPAY_KEY_SECRET.encode("utf-8"),
        f"{req.razorpay_order_id}|{req.razorpay_payment_id}".encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

    if not hmac.compare_digest(expected_sig, req.razorpay_signature):
        raise HTTPException(status_code=400, detail="Payment signature verification failed.")

    # TODO: Record purchase in DB (mm_purchases table — to be added in next sprint)
    # For now, return success with the verified payment details
    return {
        "status": "verified",
        "payment_id": req.razorpay_payment_id,
        "bundle": req.bundle,
        "email": req.email,
    }


def register_moneymind_routes(app):
    app.include_router(router)
