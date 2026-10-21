import { CustomerForm } from "@/components/admin/CustomerForm";

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">New customer</h1>
      <CustomerForm />
    </div>
  );
}
