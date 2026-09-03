export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  vegetarian: boolean;
  containsPeanuts: boolean;
  ingredientDataKnown: boolean;
  category: "Small plates" | "From the kitchen" | "Something sweet";
  tone: string;
};

export const TABLE_MENU: MenuItem[] = [
  { id: "charred-corn", name: "Charred Corn Chaat", description: "Sweet corn, lime, smoked chilli, fresh coriander", price: 340, vegetarian: true, containsPeanuts: false, ingredientDataKnown: true, category: "Small plates", tone: "saffron" },
  { id: "peanut-noodles", name: "Peanut Noodle Salad", description: "Rice noodles, cucumber, herbs, roasted peanut dressing", price: 420, vegetarian: true, containsPeanuts: true, ingredientDataKnown: true, category: "Small plates", tone: "leaf" },
  { id: "kebab", name: "Pepper Chicken Kebab", description: "Charred chicken, black pepper, mint chutney", price: 540, vegetarian: false, containsPeanuts: false, ingredientDataKnown: true, category: "Small plates", tone: "ember" },
  { id: "paneer", name: "Roasted Paneer Bowl", description: "Millet, roast vegetables, green chutney, hung curd", price: 590, vegetarian: true, containsPeanuts: false, ingredientDataKnown: true, category: "From the kitchen", tone: "cream" },
  { id: "market-special", name: "Market Special", description: "Today’s seasonal plate, composed by the kitchen", price: 650, vegetarian: true, containsPeanuts: false, ingredientDataKnown: false, category: "From the kitchen", tone: "plum" },
  { id: "tikka", name: "Chicken Tikka Plate", description: "Coal-roasted chicken, saffron rice, pickled onions", price: 720, vegetarian: false, containsPeanuts: false, ingredientDataKnown: true, category: "From the kitchen", tone: "brick" },
  { id: "pumpkin", name: "Pumpkin & Peanut Curry", description: "Roast pumpkin, coconut, peanuts, red rice", price: 610, vegetarian: true, containsPeanuts: true, ingredientDataKnown: true, category: "From the kitchen", tone: "ochre" },
  { id: "fish", name: "Coastal Fish Fry", description: "Catch of the day, kokum, cabbage slaw", price: 780, vegetarian: false, containsPeanuts: false, ingredientDataKnown: true, category: "From the kitchen", tone: "sea" },
  { id: "kulfi", name: "Pistachio Kulfi", description: "Slow-set milk, pistachio, rose", price: 290, vegetarian: true, containsPeanuts: false, ingredientDataKnown: true, category: "Something sweet", tone: "rose" },
];

export const TABLE_MENU_COUNTS = {
  total: TABLE_MENU.length,
  vegetarian: TABLE_MENU.filter((item) => item.vegetarian).length,
  knownPeanutItems: TABLE_MENU.filter((item) => item.ingredientDataKnown && item.containsPeanuts).length,
  unknownIngredientItems: TABLE_MENU.filter((item) => !item.ingredientDataKnown).length,
};

export const formatMenuPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;
