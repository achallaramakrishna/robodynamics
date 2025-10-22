package com.robodynamics.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.RDFinanceLedger;
import com.robodynamics.service.RDFinanceLedgerService;

@Controller
@RequestMapping("/finance/ledger")
public class RDFinanceLedgerController {

    @Autowired
    private RDFinanceLedgerService ledgerService;

    @GetMapping
    public String showLedger(Model model) {
        List<RDFinanceLedger> ledgerEntries = ledgerService.findAll();
        double totalBalance = ledgerService.calculateTotalBalance();
        model.addAttribute("entries", ledgerEntries);
        model.addAttribute("totalBalance", totalBalance);
        model.addAttribute("newEntry", new RDFinanceLedger());
        return "finance/finance_ledger";
    }

    @PostMapping("/save")
    public String saveEntry(@ModelAttribute("newEntry") RDFinanceLedger entry) {
        if (entry.getLedgerId() == null)
            ledgerService.save(entry);
        else
            ledgerService.update(entry);
        return "redirect:/finance/ledger";
    }

    @GetMapping("/edit")
    public String editEntry(@RequestParam("id") Integer id, Model model) {
        RDFinanceLedger entry = ledgerService.findById(id);
        model.addAttribute("newEntry", entry);
        model.addAttribute("entries", ledgerService.findAll());
        model.addAttribute("totalBalance", ledgerService.calculateTotalBalance());
        return "finance/finance_ledger";
    }

    @GetMapping("/delete")
    public String deleteEntry(@RequestParam("id") Integer id) {
        ledgerService.delete(id);
        return "redirect:/finance/ledger";
    }
}
