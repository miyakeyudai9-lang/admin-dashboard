"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import type { SidebarItem } from "@/components/Sidebar/sidebar.type";
import {
  clientStatusOptions,
  coeStatusOptions,
  findClientById,
  genderOptions,
  visaStatusOptions,
  visaTypeOptions,
} from "@/components/Staff/staff.type";

type DetailField = {
  label: string;
  value?: string | number;
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
  const clientId = Number(searchParams.get("clientId") ?? 0);
  const result = findClientById(clientId);

  const handleSidebarSelect = (item: SidebarItem) => {
    if (item === "Dashboard") {
      router.push("/admin/dashboard");
      return;
    }

    router.push("/staff");
  };

  if (!result) {
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
            { label: "Staff", href: "/staff" },
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

  const { client, staff } = result;

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
          { label: "Staff", href: "/staff" },
          { label: staff.name, href: `/client?staffId=${staff.id}` },
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
                Assigned to {staff.name}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <DetailSelect
                label="Visa Type"
                value={client.visaType}
                options={visaTypeOptions}
              />
              <DetailSelect
                label="COE Status"
                value={client.coeStatus}
                options={coeStatusOptions}
              />
              <DetailSelect
                label="Visa Status"
                value={client.visaStatus}
                options={visaStatusOptions}
              />
              <DetailSelect
                label="Client Status"
                value={client.clientStatus}
                options={clientStatusOptions}
              />
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
        >
          <DetailSelect
            label="Gender"
            value={client.gender ?? "Other"}
            options={genderOptions}
          />
        </DetailSection>

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
          title="Files and Remarks"
          fields={[
            { label: "Client Image", value: client.clientImage },
            { label: "CV", value: client.cv },
            { label: "Remarks", value: client.remarks },
          ]}
        />
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
        selected="Staff"
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

function DetailSelect<T extends string>({
  label,
  value,
  options,
}: {
  label: string;
  value: T;
  options: T[];
}) {
  return (
    <label className="block min-w-40">
      <span className="text-xs font-semibold uppercase text-gray-500">{label}</span>
      <select
        defaultValue={value}
        className="mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-blue-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
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
