export const categories = [
  {
    // parent_category_id
    id: 1,
    name: "Men",
    image: "/images/men.jpg",
    // category_id
    subcategories: [
      {
        name: "All",
        id: 1,
      },
      {
        name: "Top",
        id: 5,
      },
      {
        name: "Bottom",
        id: 6,
      },
      {
        name: "Shoes",
        id: 7,
      },
    ],
  },
  {
    // parent_category_id
    id: 2,
    name: "Women",
    image: "/images/women.jpg",
    // category_id
    subcategories: [
      {
        name: "All",
        id: 2,
      },
      {
        name: "Top",
        id: 8,
      },
      {
        name: "Bottom",
        id: 9,
      },
      {
        name: "Shoes",
        id: 10,
      },
    ],
  },
  {
    // parent_category_id
    id: 3,
    name: "Food",
    image: "/images/food.jpg",
    // category_id
    subcategories: [
      {
        name: "All",
        id: 3,
      },
      {
        name: "Eat",
        id: 11,
      },
      {
        name: "Drink",
        id: 12,
      },
    ],
  },
  {
    // parent_category_id
    name: "Others",
    image: "/images/others.png",
    id: 4,
    // category_id
    subcategories: [
      {
        name: "All",
        id: 4,
      },
      {
        name: "Furniture",
        id: 13,
      },
      {
        name: "Electronics",
        id: 14,
      },
      {
        name: "Accessories",
        id: 15,
      },
      {
        name: "Bikes",
        id: 16,
      },
    ],
  },
];

// Interfaces for form data
export interface ItemFormData {
  name: string;
  price: number;
  description: string;
  categories: number[]; // Array of category IDs
  details: {
    color: string;
    detail?: string;
  };
  sizes: {
    size: string;
    quantity: number;
  }[];
  images: {
    image_url: string;
    quality: "low" | "medium";
    is_primary: boolean;
  }[];
  detail_images: {
    image_url: string;
    display_order: number;
  }[];
}

// Example form data
export const exampleItemFormData: ItemFormData = {
  name: "Classic White T-Shirt",
  price: 29.99,
  description: "A comfortable cotton t-shirt perfect for everyday wear",
  categories: [1, 5], // Men's category and Top subcategory
  details: {
    color: "White",
    detail: "100% cotton",
  },
  sizes: [
    { size: "S", quantity: 10 },
    { size: "M", quantity: 15 },
    { size: "L", quantity: 8 },
  ],
  images: [
    {
      image_url: "/images/tshirt-white-1.jpg",
      quality: "medium",
      is_primary: true,
    },
    {
      image_url: "/images/tshirt-white-2.jpg",
      quality: "low",
      is_primary: false,
    },
  ],
  detail_images: [
    {
      image_url: "/images/tshirt-white-detail-1.jpg",
      display_order: 1,
    },
    {
      image_url: "/images/tshirt-white-detail-2.jpg",
      display_order: 2,
    },
  ],
};
