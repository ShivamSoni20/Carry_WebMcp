export type NearEvent = {
  name: string;
  venue: string;
  neighborhood: string;
  city: "Sagar" | "Indore" | "Bhopal";
  basePrice: number;
  bookingFee: number;
  date: string;
  time: string;
  category: string;
  color: string;
};

export const NEAR_EVENTS: NearEvent[] = [
  { name: "Indie Music Night", venue: "The Courtyard", neighborhood: "Civil Lines", city: "Sagar", basePrice: 899, bookingFee: 150, date: "Fri, Sep 11", time: "7:30 PM", category: "Music", color: "coral" },
  { name: "Founders After Hours", venue: "Workroom 17", neighborhood: "Makronia", city: "Sagar", basePrice: 299, bookingFee: 50, date: "Sat, Sep 12", time: "5:00 PM", category: "Meetup", color: "blue" },
  { name: "Bundelkhand Food Festival", venue: "Lake Grounds", neighborhood: "Gopal Ganj", city: "Sagar", basePrice: 149, bookingFee: 30, date: "Sun, Sep 13", time: "12:00 PM", category: "Food", color: "amber" },
  { name: "Small Town, Big Laughs", venue: "Rangmanch Hall", neighborhood: "Tilak Ganj", city: "Sagar", basePrice: 599, bookingFee: 100, date: "Sun, Sep 13", time: "8:00 PM", category: "Comedy", color: "violet" },
  { name: "Type & Texture Workshop", venue: "Studio Neem", neighborhood: "Shastri Ward", city: "Sagar", basePrice: 1199, bookingFee: 200, date: "Wed, Sep 16", time: "10:30 AM", category: "Design", color: "mint" },
  { name: "The Slow Sunday Market", venue: "Old Mill Yard", neighborhood: "Katra Bazaar", city: "Sagar", basePrice: 0, bookingFee: 0, date: "Sun, Sep 20", time: "9:00 AM", category: "Market", color: "rose" },
];

export const eventTotal = (event: Pick<NearEvent, "basePrice" | "bookingFee">) => event.basePrice + event.bookingFee;
export const formatRupees = (value: number) => `₹${value.toLocaleString("en-IN")}`;
