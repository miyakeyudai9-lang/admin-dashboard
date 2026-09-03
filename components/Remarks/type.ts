export type RemarkEntry = {
  id: string;
  date: string;
  staffName: string;
  text: string;
};

export type RemarksProps = {
  mode?: "view" | "edit";
  value?: string;
  remarks?: RemarkEntry[];
  staffName?: string;
};