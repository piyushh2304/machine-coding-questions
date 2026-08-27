export const departments = [
    {
        label: "IT Support",
        issues: [
            {
                label: "Laptop Issue",
                template: "Laptop Model:\nSerial Number:\nIssue Description:"
            },
            {
                label: "Network Issue",
                template: ""
            },
            {
                label: "Software Installation",
                template: "Software Name:\nVersion:\nReason for Request:"
            }
        ]
    },
    {
        label: "Human Resources",
        issues: [
            {
                label: "Payroll Query",
                template: "Employee ID:\nPay Period:\nSpecific Question:"
            },
            {
                label: "Benefits Enrollment",
                template: "Plan Name:\nEffective Date:\nChanges Requested:"
            }
        ]
    },
    {
        label: "Facilities",
        issues: [
            {
                label: "Maintenance Request",
                template: "Location/Room #:\nUrgency (Low/Med/High):\nDescription:"
            },
            {
                label: "Access Card Issue",
                template: "Card Number (if known):\nAccess Point:"
            }
        ]
    }
].sort((a, b) => a.label.localeCompare(b.label)); // Ensure A-Z sorting
