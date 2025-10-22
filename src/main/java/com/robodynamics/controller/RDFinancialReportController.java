package com.robodynamics.controller;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.robodynamics.model.RDFinancialReport;
import com.robodynamics.service.RDFinancialReportService;

@Controller
@RequestMapping("/finance/reports")
public class RDFinancialReportController {

    @Autowired
    private RDFinancialReportService reportService;

    @GetMapping
    public String listReports(Model model) {
        List<RDFinancialReport> reports = reportService.findAll();
        model.addAttribute("reports", reports);
        return "finance/financial_report_list";
    }

    @PostMapping("/generate")
    public String generateReport(@RequestParam("month") String month) {
        reportService.generateMonthlyReport(month);
        return "redirect:/finance/reports";
    }

    @GetMapping("/delete")
    public String deleteReport(@RequestParam("id") Integer id) {
        reportService.delete(id);
        return "redirect:/finance/reports";
    }
    @GetMapping("/export/excel")
    public void exportExcel(HttpServletResponse response) throws Exception {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=FinancialReports.xlsx");

        List<RDFinancialReport> reports = reportService.findAll();

        org.apache.poi.xssf.usermodel.XSSFWorkbook workbook = new org.apache.poi.xssf.usermodel.XSSFWorkbook();
        org.apache.poi.ss.usermodel.Sheet sheet = workbook.createSheet("Reports");

        org.apache.poi.ss.usermodel.Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Month");
        header.createCell(1).setCellValue("Total Income");
        header.createCell(2).setCellValue("Total Expense");
        header.createCell(3).setCellValue("Net Profit");

        int rowNum = 1;
        for (RDFinancialReport r : reports) {
            org.apache.poi.ss.usermodel.Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(r.getReportMonth());
            row.createCell(1).setCellValue(r.getTotalIncome());
            row.createCell(2).setCellValue(r.getTotalExpense());
            row.createCell(3).setCellValue(r.getNetProfit());
        }

        workbook.write(response.getOutputStream());
        workbook.close();
    }

    @GetMapping("/export/pdf")
    public void exportPdf(HttpServletResponse response) throws Exception {
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=FinancialReports.pdf");

        List<RDFinancialReport> reports = reportService.findAll();

        com.itextpdf.text.Document document = new com.itextpdf.text.Document();
        com.itextpdf.text.pdf.PdfWriter.getInstance(document, response.getOutputStream());
        document.open();

        document.add(new com.itextpdf.text.Paragraph("Robo Dynamics - Financial Reports"));
        document.add(new com.itextpdf.text.Paragraph(" "));

        com.itextpdf.text.pdf.PdfPTable table = new com.itextpdf.text.pdf.PdfPTable(4);
        table.addCell("Month");
        table.addCell("Total Income");
        table.addCell("Total Expense");
        table.addCell("Net Profit");

        for (RDFinancialReport r : reports) {
            table.addCell(r.getReportMonth());
            table.addCell(String.format("₹%.2f", r.getTotalIncome()));
            table.addCell(String.format("₹%.2f", r.getTotalExpense()));
            table.addCell(String.format("₹%.2f", r.getNetProfit()));
        }

        document.add(table);
        document.close();
    }

}
