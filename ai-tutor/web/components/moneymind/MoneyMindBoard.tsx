"use client";

import React from "react";
import "./MoneyMindBoard.css";

import AtmSimulator from "./AtmSimulator";
import BankPortal from "./BankPortal";
import UpiSimulator from "./UpiSimulator";
import ScamSimulator from "./ScamSimulator";
import MoneyGarden from "./MoneyGarden";
import SalaryDecoder from "./SalaryDecoder";
import SavingsGoalTracker from "./SavingsGoalTracker";
import ParentDashboard from "./ParentDashboard";
import PocketMoneyPlanner from "./PocketMoneyPlanner";
import WorkedExample from "./WorkedExample";
import PracticeBoard from "./PracticeBoard";
import BudgetPlanner from "./BudgetPlanner";

type MoneyMindBoardProps = {
  boardType: string;
  data: any;
  practice?: any; // Added for MCQ support
  userId: string | number;
};

export default function MoneyMindBoard({ boardType, data, practice, userId }: MoneyMindBoardProps) {
  // Convert string userId to number if needed for the simulation API
  const uid = typeof userId === "string" ? parseInt(userId) || 1 : userId;

  switch (boardType) {
    case "atm_simulator":
      return (
        <div className="mm-board-container">
          <AtmSimulator userId={uid} />
        </div>
      );
    case "bank_simulator":
    case "passbook_viewer":
      return (
        <div className="mm-board-container">
          <BankPortal userId={uid} />
        </div>
      );
    case "upi_simulator":
      return (
        <div className="mm-board-container">
          <UpiSimulator userId={uid} />
        </div>
      );
    case "scam_simulator":
    case "scam_detector":
      return (
        <div className="mm-board-container">
          <ScamSimulator data={data} />
        </div>
      );
    case "salary_decoder":
    case "salary_slip":
    case "paycheck_lab":
      return (
        <div className="mm-board-container">
          <SalaryDecoder data={data} />
        </div>
      );
    case "money_garden":
    case "garden_simulator":
    case "compounding_garden":
      return (
        <div className="mm-board-container">
          <MoneyGarden data={data} />
        </div>
      );
    case "savings_goal":
    case "savings_goal_tracker":
    case "goal_tracker":
      return (
        <div className="mm-board-container">
          <SavingsGoalTracker userId={uid} />
        </div>
      );
    case "pocket_money_planner":
      return (
        <div className="mm-board-container">
          <PocketMoneyPlanner />
        </div>
      );
    case "budget_planner":
    case "shopping_simulation":
      return (
        <div className="mm-board-container">
          <BudgetPlanner data={data} />
        </div>
      );
    case "worked_example":
      return (
        <div className="mm-board-container">
          <WorkedExample data={data} />
        </div>
      );
    case "practice_board":
      return (
        <div className="mm-board-container">
          <PracticeBoard data={data} practice={practice} />
        </div>
      );
    case "parent_dashboard":
      return (
        <div className="mm-board-container">
          <ParentDashboard userId={uid} />
        </div>
      );
    case "intro_card":
    case "mission_card":
      return <InfoCard data={data} type="mission" />;
    case "concept_card":
      return <InfoCard data={data} type="concept" />;
    case "recap_summary":
      return <InfoCard data={data} type="recap" />;
    default:
      return (
        <div className="mm-board-fallback">
          <h3>{boardType}</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      );
  }
}

function InfoCard({ data, type }: { data: any; type: string }) {
  const isRecap = type === "recap";
  return (
    <div className={`mm-card mm-card-${type}`}>
      {data.headline && <h2 className="mm-card-headline">{data.headline}</h2>}
      {data.title && <h3 className="mm-card-title">{data.title}</h3>}
      {data.challenge && <p className="mm-card-challenge">{data.challenge}</p>}
      
      {data.sections ? (
        <div className="mm-card-sections">
          {data.sections.map((s: any, i: number) => (
            <div key={i} className="mm-card-section" style={{ borderLeft: `4px solid ${s.color || '#ccc'}` }}>
              <h4>{s.label}</h4>
              <ul>
                {s.items.map((it: string, j: number) => <li key={j}>{it}</li>)}
              </ul>
            </div>
          ))}
        </div>
      ) : null}

      {data.points ? (
        <ul className="mm-card-points">
          {data.points.map((p: string, i: number) => <li key={i}>{p}</li>)}
        </ul>
      ) : null}

      {data.remember ? (
        <div className="mm-card-remember">
          <h4>💡 Remember</h4>
          <ul>
            {data.remember.map((r: string, i: number) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      ) : null}

      {data.takeaway && <p className="mm-card-takeaway">🎯 {data.takeaway}</p>}

      {data.visual && (
        <div className="mm-card-visual">
          <img src={data.visual} alt="Card Visual" />
        </div>
      ) || data.assetPath && (
        <div className="mm-card-visual">
          <img src={data.assetPath} alt="Card Asset" />
        </div>
      )}
    </div>
  );
}

function ShoppingSim({ data }: { data: any }) {
  return (
    <div className="mm-shopping-sim">
      <h3>Shopping Simulation</h3>
      <div className="mm-sim-budget">Budget: ₹{data.budget}</div>
      <div className="mm-sim-items">
        {data.items.map((item: any, i: number) => (
          <div key={i} className="mm-sim-item">
            <span className="mm-item-name">{item.name}</span>
            <span className="mm-item-price">₹{item.price}</span>
            <span className={`mm-item-tag ${item.type}`}>{item.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
