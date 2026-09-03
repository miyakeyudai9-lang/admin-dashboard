export type Client = {
  clientId: number;
  assignedStaffId?: number;
  fullName: string;
  dateOfBirth?: string;
  gender?: "Male" | "Female" | "Other";
  phone: string;
  email?: string;
  address?: string;
  nationality?: string;
  passportNumber?: string;
  passportExpiryDate?: string;
  visaType: "Student" | "Working" | "Dependent";
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
  remarks?: string;
  clientImage?: string;
  cv?: string;
};

export type Staff = {
  id: number;
  name: string;
  phone: string;
  location: string;
  email: string;
  clients: Client[];
};

export const staffData: Staff[] = [
  {
    id: 1,
    name: "Ram Sharma",
    phone: "9800000001",
    location: "Kathmandu",
    email: "ram.sharma@gmail.com",
    clients: [
      {
        clientId: 101,
        fullName: "Anil Bista",
        dateOfBirth: "2001-04-12",
        gender: "Male",
        phone: "9800000101",
        email: "anil.bista@gmail.com",
        address: "Pokhara",
        nationality: "Nepali",
        passportNumber: "PA1234567",
        passportExpiryDate: "2030-08-20",
        visaType: "Student",
        lastQualification: "+2 Management",
        japaneseLanguageLevel: "N4",
        schoolName: "Tokyo International Japanese School",
        course: "Japanese Language",
        intake: "April 2027",
        coeStatus: "Processing",
        visaStatus: "Not Applied",
        clientStatus: "COE Applied",
        remarks: "Documents verified by staff.",
      },
      {
        clientId: 102,
        fullName: "Sunita Karki",
        dateOfBirth: "1999-11-03",
        gender: "Female",
        phone: "9800000102",
        email: "sunita.karki@gmail.com",
        address: "Biratnagar",
        nationality: "Nepali",
        passportNumber: "PB2345678",
        passportExpiryDate: "2029-01-10",
        visaType: "Working",
        statusOfResidence: "Specified Skilled Worker",
        jobCategory: "Hospitality",
        jobTitle: "Hotel Staff",
        companyName: "Sakura Hospitality Group",
        workLocation: "Osaka",
        coeStatus: "Received",
        visaStatus: "Applied",
        clientStatus: "Visa Applied",
      },
      {
        clientId: 103,
        fullName: "Bikash Gurung",
        dateOfBirth: "1998-07-22",
        gender: "Male",
        phone: "9800000103",
        email: "bikash.gurung@gmail.com",
        address: "Lalitpur",
        nationality: "Nepali",
        passportNumber: "PC3456789",
        visaType: "Dependent",
        sponsorName: "Mina Gurung",
        sponsorRelationship: "Spouse",
        sponsorStatusOfResidence: "Engineer/Specialist",
        coeStatus: "Applied",
        visaStatus: "Not Applied",
        clientStatus: "Document Collection",
      },
    ],
  },
  {
    id: 2,
    name: "Hari Thapa",
    phone: "9800000002",
    location: "Bhaktapur",
    email: "hari.thapa@gmail.com",
    clients: [
      {
        clientId: 201,
        fullName: "Nabin Shrestha",
        dateOfBirth: "2000-02-18",
        gender: "Male",
        phone: "9800000201",
        email: "nabin.shrestha@gmail.com",
        address: "Kathmandu",
        nationality: "Nepali",
        passportNumber: "PD4567890",
        visaType: "Student",
        lastQualification: "Bachelor Running",
        japaneseLanguageLevel: "N5",
        schoolName: "Nagoya Language Academy",
        course: "Japanese Language",
        intake: "July 2027",
        coeStatus: "Not Applied",
        visaStatus: "Not Applied",
        clientStatus: "New",
      },
      {
        clientId: 202,
        fullName: "Pratima Rai",
        dateOfBirth: "1997-09-14",
        gender: "Female",
        phone: "9800000202",
        email: "pratima.rai@gmail.com",
        address: "Butwal",
        nationality: "Nepali",
        passportNumber: "PE5678901",
        visaType: "Working",
        statusOfResidence: "Skilled Labor",
        jobCategory: "Caregiving",
        jobTitle: "Care Worker",
        companyName: "Hikari Care Home",
        workLocation: "Fukuoka",
        coeStatus: "Received",
        visaStatus: "Approved",
        clientStatus: "Visa Approved",
      },
    ],
  },
  {
    id: 3,
    name: "Sita Rai",
    phone: "9800000003",
    location: "Dharan",
    email: "sita.rai@gmail.com",
    clients: [
      {
        clientId: 301,
        fullName: "Roshan Limbu",
        dateOfBirth: "2002-05-30",
        gender: "Male",
        phone: "9800000301",
        email: "roshan.limbu@gmail.com",
        address: "Janakpur",
        nationality: "Nepali",
        passportNumber: "PF6789012",
        visaType: "Student",
        lastQualification: "+2 Science",
        japaneseLanguageLevel: "N4",
        schoolName: "Kyoto Japanese Institute",
        course: "Language and Culture",
        intake: "October 2027",
        coeStatus: "Applied",
        visaStatus: "Not Applied",
        clientStatus: "Processing",
      },
      {
        clientId: 302,
        fullName: "Maya Tamang",
        dateOfBirth: "1996-12-09",
        gender: "Female",
        phone: "9800000302",
        email: "maya.tamang@gmail.com",
        address: "Hetauda",
        nationality: "Nepali",
        passportNumber: "PG7890123",
        visaType: "Dependent",
        sponsorName: "Kiran Tamang",
        sponsorRelationship: "Husband",
        sponsorStatusOfResidence: "Student",
        coeStatus: "Rejected",
        visaStatus: "Rejected",
        clientStatus: "Visa Rejected",
        remarks: "Needs document review before re-application.",
      },
      {
        clientId: 303,
        fullName: "Deepak Adhikari",
        dateOfBirth: "1995-03-25",
        gender: "Male",
        phone: "9800000303",
        email: "deepak.adhikari@gmail.com",
        address: "Bharatpur",
        nationality: "Nepali",
        passportNumber: "PH8901234",
        visaType: "Working",
        statusOfResidence: "Engineer/Specialist",
        jobCategory: "IT",
        jobTitle: "Frontend Developer",
        companyName: "Nippon Digital Works",
        workLocation: "Tokyo",
        coeStatus: "Received",
        visaStatus: "Processing",
        clientStatus: "Visa Applied",
      },
    ],
  },
];

export const allClients: Client[] = staffData.flatMap((staff) =>
  staff.clients.map((client) => ({
    ...client,
    assignedStaffId: staff.id,
  })),
);

export const visaTypeOptions: Client["visaType"][] = [
  "Student",
  "Working",
  "Dependent",
];

export const coeStatusOptions: Client["coeStatus"][] = [
  "Not Applied",
  "Applied",
  "Processing",
  "Received",
  "Rejected",
];

export const visaStatusOptions: Client["visaStatus"][] = [
  "Not Applied",
  "Applied",
  "Processing",
  "Approved",
  "Rejected",
];

export const clientStatusOptions: Client["clientStatus"][] = [
  "New",
  "Document Collection",
  "Processing",
  "COE Applied",
  "COE Received",
  "Visa Applied",
  "Visa Approved",
  "Visa Rejected",
  "Departed",
  "Arrived in Japan",
];

export const genderOptions: NonNullable<Client["gender"]>[] = [
  "Male",
  "Female",
  "Other",
];

export function findClientById(clientId: number) {
  for (const staff of staffData) {
    const client = staff.clients.find((item) => item.clientId === clientId);

    if (client) {
      return { client, staff };
    }
  }

  return null;
}
