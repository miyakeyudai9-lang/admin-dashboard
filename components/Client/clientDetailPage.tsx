"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Navbar from "@/components/Navbar";
import Remarks from "@/components/Remarks";
import ReusableForm from "@/components/ReusableForm";
import { clientFormDefaults, getClientFormFields } from "@/components/ReusableForm/form-configs";
import Sidebar from "@/components/Sidebar";
import type { SidebarItem } from "@/components/Sidebar/sidebar.type";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth-store";

type DetailField = {
  label: string;
  value?: string | number;
};

type StaffApiResponse = {
  _id?: string;
  staffId?: number | string;
  name: string;
  email?: string;
};

type ClientApiResponse = {
  _id?: string;
  clientId?: number | string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: "Male" | "Female" | "Other";
  phone?: string;
  email?: string;
  address?: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiryDate?: string;
  visaType?: "Student" | "Working" | "Dependent";
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
  coeStatus?: "Not Applied" | "Applied" | "Processing" | "Received" | "Rejected";
  visaStatus?: "Not Applied" | "Applied" | "Processing" | "Approved" | "Rejected";
  clientStatus?:
    | "New"
    | "Document Collection"
    | "Processing"
    | "COE Applied"
    | "COE Received"
    | "Visa Applied"
    | "Visa Approved"
    | "Visa Rejected"
    | "Departed"
    | "Arrived in Japan";
  assignedStaff?: StaffApiResponse | string | null;
  remarks?: string;
  clientImage?: string;
  cv?: string;
};

type ClientDetailRecord = {
  _id?: string;
  clientId: number;
  fullName: string;
  phone: string;
  visaType: "Student" | "Working" | "Dependent";
  coeStatus: "Not Applied" | "Applied" | "Processing" | "Received" | "Rejected";
  visaStatus: "Not Applied" | "Applied" | "Processing" | "Approved" | "Rejected";
  clientStatus:
    | "New"
    | "Document Collection"
    | "Processing"
    | "COE Applied"
    | "COE Received"
    | "Visa Applied"
    | "Visa Approved"
    | "Visa Rejected"
    | "Departed"
    | "Arrived in Japan";
  assignedStaff?: StaffApiResponse | string | null;
  dateOfBirth?: string;
  gender?: "Male" | "Female" | "Other";
  email?: string;
  address?: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiryDate?: string;
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
  remarks?: string;
  clientImage?: string;
  cv?: string;
};

export default function ClientDetailPage() {
  return (
    <Suspense fallback={<ClientDetailFallback />}>
      <ClientDetailPageContent />
    </Suspense>
  );
}

function ClientDetailPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [staffs, setStaffs] = useState<Array<{ _id?: string; id: number; name: string }>>([]);
  const [client, setClient] = useState<ClientDetailRecord | null>(null);
  const [loadingClient, setLoadingClient] = useState(true);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [defaultClientId] = useState(() => Date.now());
  const user = useAuthStore((state) => state.user);
  const mode = searchParams.get("mode");
  const clientId = Number(searchParams.get("clientId") ?? 0);
  const isSuperAdmin = user?.role === "superadmin";

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoadingClient(mode !== "create");

        const staffResponse = await api.get("/staff");
        const staffList = Array.isArray(staffResponse.data) ? staffResponse.data : [];
        const mappedStaffs = staffList.map((staff: StaffApiResponse) => ({
            _id: staff._id,
            id: Number(staff.staffId ?? 0),
            name: staff.name,
          }));

        setStaffs(mappedStaffs);

        if (mode === "create") {
          setClient(null);
          return;
        }

        const clientResponse = await api.get("/clients");
        const rawClients = Array.isArray(clientResponse.data?.data)
          ? clientResponse.data.data
          : Array.isArray(clientResponse.data)
            ? clientResponse.data
            : [];
        const matchedClient = rawClients.find(
          (item: ClientApiResponse) => Number(item.clientId ?? 0) === clientId,
        );

        setClient(matchedClient ? mapClientDetail(matchedClient) : null);
      } catch (error) {
        console.error("Failed to load client detail data", error);
        setClient(null);
        setStaffs([]);
      } finally {
        setLoadingClient(false);
      }
    };

    loadPageData();
  }, [clientId, mode]);

  const assignedStaff = useMemo(() => {
    if (!client?.assignedStaff) {
      return null;
    }

    if (typeof client.assignedStaff === "object") {
      return client.assignedStaff;
    }

    return (
      staffs.find((staff) => String(staff._id) === String(client.assignedStaff)) ??
      null
    );
  }, [client, staffs]);

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

  const handleCreateClient = async (values: Record<string, string>) => {
    setSaving(true);
    setFormError("");

    try {
      const payload = compactPayload({
        ...values,
        clientId: Number(values.clientId),
        assignedStaff: isSuperAdmin ? values.assignedStaff || undefined : undefined,
      });

      await api.post("/clients", payload);

      router.push("/client");
    } catch (error) {
      console.error("Failed to create client", error);
      setFormError("Failed to create client.");
    } finally {
      setSaving(false);
    }
  };

  if (mode === "create") {
    return (
      <PageShell
        title="Add Client"
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        onSidebarSelect={handleSidebarSelect}
      >
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Clients", href: "/client" },
            { label: "Add Client", current: true },
          ]}
        />

        <div className="mt-6">
          <ReusableForm
            title="Client Information"
            fields={getClientFormFields(
              staffs.map((staff) => ({
                label: staff.name,
                value: String(staff._id ?? staff.id),
              })),
              isSuperAdmin,
            )}
            defaultValues={{
              ...clientFormDefaults,
              clientId: defaultClientId,
            }}
            submitLabel="Save Client"
            loading={saving}
            error={formError}
            onSubmit={handleCreateClient}
            onCancel={() => router.push("/client")}
          />
        </div>
      </PageShell>
    );
  }

  if (loadingClient) {
    return (
      <PageShell
        title="Client Details"
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        onSidebarSelect={handleSidebarSelect}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-gray-600 shadow-sm">
          Loading client details...
        </div>
      </PageShell>
    );
  }

  if (!client) {
    return (
      <PageShell
        title="Client Details"
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
        onSidebarSelect={handleSidebarSelect}
      >
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/admin/dashboard" },
            { label: "Clients", href: "/client" },
            { label: "Client not found", current: true },
          ]}
        />

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">Client not found</h3>
          <p className="mt-2 text-sm text-gray-600">
            The selected client record does not exist.
          </p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title={client.fullName}
      sidebarCollapsed={sidebarCollapsed}
      onToggleSidebar={() => setSidebarCollapsed((prev) => !prev)}
      onSidebarSelect={handleSidebarSelect}
    >
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Clients", href: "/client" },
          ...(assignedStaff?._id
            ? [
                {
                  label: assignedStaff.name,
                  href: `/staff/${assignedStaff._id}/clients`,
                },
              ]
            : []),
          { label: client.fullName, current: true },
        ]}
      />

      <div className="space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Client #{client.clientId}
              </p>
              <h3 className="mt-1 text-2xl font-semibold text-gray-900">
                {client.fullName}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Assigned to {assignedStaff?.name ?? "Unassigned"}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <DetailValue label="Visa Type" value={client.visaType} />
              <DetailValue label="COE Status" value={client.coeStatus} />
              <DetailValue label="Visa Status" value={client.visaStatus} />
              <DetailValue label="Client Status" value={client.clientStatus} />
            </div>
          </div>
        </section>

        <DetailSection
          title="Personal Information"
          fields={[
            { label: "Full Name", value: client.fullName },
            { label: "Date of Birth", value: formatDate(client.dateOfBirth) },
            { label: "Gender", value: client.gender },
            { label: "Phone", value: client.phone },
            { label: "Email", value: client.email },
            { label: "Address", value: client.address },
            { label: "Nationality", value: client.nationality ?? "Nepali" },
          ]}
        />

        <DetailSection
          title="Passport and Visa"
          fields={[
            { label: "Passport Number", value: client.passportNumber },
            {
              label: "Passport Expiry Date",
              value: formatDate(client.passportExpiryDate),
            },
            { label: "Status of Residence", value: client.statusOfResidence },
          ]}
        />

        <DetailSection
          title="Student Details"
          fields={[
            { label: "Last Qualification", value: client.lastQualification },
            {
              label: "Japanese Language Level",
              value: client.japaneseLanguageLevel,
            },
            { label: "School Name", value: client.schoolName },
            { label: "Course", value: client.course },
            { label: "Intake", value: client.intake },
          ]}
        />

        <DetailSection
          title="Working Details"
          fields={[
            { label: "Job Category", value: client.jobCategory },
            { label: "Job Title", value: client.jobTitle },
            { label: "Company Name", value: client.companyName },
            { label: "Work Location", value: client.workLocation },
          ]}
        />

        <DetailSection
          title="Sponsor Details"
          fields={[
            { label: "Sponsor Name", value: client.sponsorName },
            { label: "Sponsor Relationship", value: client.sponsorRelationship },
            {
              label: "Sponsor Status of Residence",
              value: client.sponsorStatusOfResidence,
            },
          ]}
        />

        <DetailSection
          title="Files"
          fields={[
            { label: "Client Image", value: client.clientImage },
            { label: "CV", value: client.cv },
          ]}
        />

        <Remarks value={client.remarks} />
      </div>
    </PageShell>
  );
}

function ClientDetailFallback() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white p-5 shadow-lg">Loading...</aside>
      <main className="flex-1 p-8">
        <div className="h-16 rounded bg-white shadow" />
      </main>
    </div>
  );
}

function PageShell({
  title,
  sidebarCollapsed,
  onToggleSidebar,
  onSidebarSelect,
  children,
}: {
  title: string;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onSidebarSelect: (item: SidebarItem) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        selected="Clients"
        onSelect={onSidebarSelect}
        collapsed={sidebarCollapsed}
        onToggle={onToggleSidebar}
      />

      <main className="flex-1 p-8">
        <Navbar title={title} />
        {children}
      </main>
    </div>
  );
}

function DetailSection({
  title,
  fields,
  children,
}: {
  title: string;
  fields: DetailField[];
  children?: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h4 className="mb-5 text-lg font-semibold text-gray-900">{title}</h4>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {fields.map((field) => (
          <DetailValue key={field.label} label={field.label} value={field.value} />
        ))}
        {children}
      </div>
    </section>
  );
}

function DetailValue({ label, value }: DetailField) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
      <p className="mt-1 text-sm text-gray-900">{value || "-"}</p>
    </div>
  );
}

function mapClientDetail(client: ClientApiResponse): ClientDetailRecord {
  return {
    _id: client._id,
    clientId: Number(client.clientId ?? 0),
    fullName: client.fullName ?? "Unknown Client",
    dateOfBirth: client.dateOfBirth,
    gender: client.gender,
    phone: client.phone ?? "N/A",
    email: client.email,
    address: client.address,
    nationality: client.nationality ?? "Nepali",
    passportNumber: client.passportNumber,
    passportExpiryDate: client.passportExpiryDate,
    visaType: client.visaType ?? "Student",
    statusOfResidence: client.statusOfResidence,
    lastQualification: client.lastQualification,
    japaneseLanguageLevel: client.japaneseLanguageLevel,
    schoolName: client.schoolName,
    course: client.course,
    intake: client.intake,
    jobCategory: client.jobCategory,
    jobTitle: client.jobTitle,
    companyName: client.companyName,
    workLocation: client.workLocation,
    sponsorName: client.sponsorName,
    sponsorRelationship: client.sponsorRelationship,
    sponsorStatusOfResidence: client.sponsorStatusOfResidence,
    coeStatus: client.coeStatus ?? "Not Applied",
    visaStatus: client.visaStatus ?? "Not Applied",
    clientStatus: client.clientStatus ?? "New",
    assignedStaff: client.assignedStaff ?? null,
    remarks: client.remarks,
    clientImage: client.clientImage,
    cv: client.cv,
  };
}

function compactPayload(payload: Record<string, string | number | undefined>) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== "" && value !== undefined),
  );
}

function formatDate(value?: string) {
  if (!value) {
    return undefined;
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
