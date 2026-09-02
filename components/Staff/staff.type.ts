export type Client = {
  id: number;
  name: string;
  phone: string;
  location: string;
  email: string;
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
        id: 101,
        name: "ABC Pvt Ltd",
        phone: "9800000101",
        location: "Pokhara",
        email: "abc@company.com",
      },
      {
        id: 102,
        name: "Sunrise Traders",
        phone: "9800000102",
        location: "Biratnagar",
        email: "sunrise@company.com",
      },
      {
        id: 103,
        name: "Green Valley",
        phone: "9800000103",
        location: "Lalitpur",
        email: "green@company.com",
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
        id: 201,
        name: "Everest Logistics",
        phone: "9800000201",
        location: "Ktm",
        email: "everest@company.com",
      },
      {
        id: 202,
        name: "Hilltop Foods",
        phone: "9800000202",
        location: "Butwal",
        email: "hilltop@company.com",
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
        id: 301,
        name: "Nova Tech",
        phone: "9800000301",
        location: "Janakpur",
        email: "nova@company.com",
      },
      {
        id: 302,
        name: "Riverside Homes",
        phone: "9800000302",
        location: "Hetauda",
        email: "riverside@company.com",
      },
      {
        id: 303,
        name: "City Mart",
        phone: "9800000303",
        location: "Bharatpur",
        email: "citymart@company.com",
      },
    ],
  },
];
