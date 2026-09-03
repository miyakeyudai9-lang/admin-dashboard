"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Navbar from "@/components/Navbar";
import ReusableForm from "@/components/ReusableForm";
import { clientFormDefaults, getClientFormFields } from "@/components/ReusableForm/form-configs";
import Remarks from "@/components/Remarks";
import Sidebar from "@/components/Sidebar";
import type { SidebarItem } from "@/components/Sidebar/sidebar.type";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";

type StaffApiResponse = {
  _id?: string;
  staffId?: number | string;
  name: string;
};

type ClientApiResponse = {
  _id?: string;
  clientId?: number | string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiryDate?: string;
  visaType?: string;
  statusOfResidence?: string;
  lastQualification?: string;
  japaneseLanguageLevel?: string;
  schoolName?: string;
  course?: string;
  intake?: string;
  jobCategory?: string;
  jobTitle?: string;
  companyName?: string;
  workLocation?: string;
  sponsorName?: string;
  sponsorRelationship?: string;
  sponsorStatusOfResidence?: string;
  coeStatus?: string;
  visaStatus?: string;
  clientStatus?: string;
  assignedStaff?: StaffApiResponse | string | null;
  remarks?: string;
  clientImage?: string;
  cv?: string;
};

export default function EditClientPage() {
  return (
    <Suspense fallback={<EditClientFallback />}>
      <EditClientPageContent />
    </Suspense>
  );
}

function EditClientPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [staffs, setStaffs] = useState<Array<{ _id?: string; id: number; name: string }>>([]);
  const [client, setClient] = useState<ClientApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const user = useAuthStore((state) => state.user);
  const clientId = Number(searchParams.get("clientId") ?? 0);
  const isSuperAdmin = user?.role === "superadmin";

  useEffect(() => {
    const loadEditData = async () => {
      try {
        const [staffResponse, clientResponse] = await Promise.all([
          api.get("/staff"),
          api.get("/clients"),
        ]);

        const staffList = Array.isArray(staffResponse.data) ? staffResponse.data : [];
        const rawClients = Array.isArray(clientResponse.data?.data)
          ? clientResponse.data.data
          : Array.isArray(clientResponse.data)
            ? clientResponse.data
            : [];

        setStaffs(
          staffList.map((staff: StaffApiResponse) => ({
            _id: staff._id,
            id: Number(staff.staffId ?? 0),
            name: staff.name,
          })),
        );
        setClient(
          rawClients.find(
            (item: ClientApiResponse) => Number(item.clientId ?? 0) === clientId,
          ) ?? null,
        );
      } catch (error) {
        console.error("Failed to load client edit data", error);
        setClient(null);
        setStaffs([]);
      } finally {
        setLoading(false);
      }
    };

    loadEditData();
  }, [clientId]);

  const defaultValues = useMemo(
    () => ({
      ...clientFormDefaults,
      ...client,
      clientId: Number(client?.clientId ?? clientId),
      dateOfBirth: formatInputDate(client?.dateOfBirth),
      passportExpiryDate: formatInputDate(client?.passportExpiryDate),
      assignedStaff:
        typeof client?.assignedStaff === "object" && client.assignedStaff
          ? client.assignedStaff._id
          : client?.assignedStaff ?? "",
    }),
    [client, clientId],
  );

  const handleSidebarSelect = (item: SidebarItem) => {
    if (item === "Dashboard") {
      router.push("/admin/dashboard");
      return;
    }

    if (item === "Staff") {
      router.push("/staff");
      return;
    }

    router.push("/client");
  };

  const handleUpdateClient = async (values: Record<string, string>) => {
    if (!client?._id) {
      setFormError("Client record id is missing.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      const remarks = buildRemarksValue({
        existingRemarks: client.remarks,
        remarksDate: values.remarksDate,
        remarksBy: values.remarksBy,
        remarksText: values.remarksText,
      });
      const payload = compactPayload({
        ...values,
        clientId: Number(values.clientId),
        assignedStaff: isSuperAdmin ? values.assignedStaff || undefined : undefined,
        remarks,
        remarksDate: undefined,
        remarksBy: undefined,
        remarksText: undefined,
      });

      await api.put(`/clients/${client._id}`, payload);
      router.push(`/client/clientDetailPage?clientId=${values.clientId}`);
    } catch (error) {
      console.error("Failed to update client", error);
      setFormError("Client update API is not available yet.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        selected="Clients"
        onSelect={handleSidebarSelect}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
      />

      <main className="flex-1 p-8">
        <Navbar title="Edit Client" />

        <div className="mb-6">
          <Breadcrumb
            items={[
              { label: "Dashboard", href: "/admin/dashboard" },
              { label: "Clients", href: "/client" },
              {
                label: client?.fullName ?? "Edit Client",
                href: `/client/edit?clientId=${clientId}`,
                current: true,
              },
            ]}
          />
        </div>

        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600 shadow-sm">
            Loading client form...
          </div>
        ) : !client ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">Client not found</h3>
            <p className="mt-2 text-sm text-gray-600">
              The selected client record does not exist.
            </p>
          </div>
        ) : (
          <ReusableForm
            title="Client Information"
            fields={getClientFormFields(
              staffs.map((staff) => ({
                label: staff.name,
                value: String(staff._id ?? staff.id),
              })),
              isSuperAdmin,
              false,
            )}
            defaultValues={defaultValues}
            submitLabel="Update Client"
            loading={saving}
            error={formError}
            onSubmit={handleUpdateClient}
            onCancel={() => router.push(`/client/clientDetailPage?clientId=${clientId}`)}
          >
            <Remarks
              mode="edit"
              defaultValue={client.remarks}
              staffName={user?.name}
            />
          </ReusableForm>
        )}
      </main>
    </div>
  );
}

function EditClientFallback() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white p-5 shadow-lg">Loading...</aside>
      <main className="flex-1 p-8">
        <div className="h-16 rounded bg-white shadow" />
      </main>
    </div>
  );
}

function compactPayload(payload: Record<string, string | number | undefined>) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== "" && value !== undefined),
  );
}

function buildRemarksValue({
  existingRemarks,
  remarksDate,
  remarksBy,
  remarksText,
}: {
  existingRemarks?: string;
  remarksDate?: string;
  remarksBy?: string;
  remarksText?: string;
}) {
  const text = remarksText?.trim();

  if (!text) {
    return existingRemarks;
  }

  const newRemark = [
    `[${remarksDate || "No date"} - Japan Time]`,
    `By: ${remarksBy || "Current Staff"}`,
    text,
  ].join("\n");

  return existingRemarks ? `${existingRemarks}\n\n${newRemark}` : newRemark;
}

function formatInputDate(value?: string) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
}
