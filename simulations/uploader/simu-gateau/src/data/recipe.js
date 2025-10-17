const recipe = {
  name: "Gâteau simple",
  baseServings: 2,
  ingredients: [
    {
      id: "eggs",
      name: "Œufs",
      unit: "Œuf(s)",
      quantity: 2,
      image: "eggs.svg",
      imageAlt: "Œufs",
    },
    {
      id: "sugar",
      name: "Sucre",
      unit: "g",
      quantity: 100,
      image: "sugar.svg",
      imageAlt: "Sucre en poudre",
    },
    {
      id: "flour",
      name: "Farine",
      unit: "g",
      quantity: 200,
      image: "flour.svg",
      imageAlt: "Farine",
    },
    {
      id: "butter",
      name: "Beurre",
      unit: "g",
      quantity: 50,
      image: "butter.svg",
      imageAlt: "Beurre",
    },
    {
      id: "yeast",
      name: "Levure chimique",
      unit: "sachet(s)",
      quantity: 1,
      image: "baking-powder.svg",
      imageAlt: "Sachet de levure",
    },
  ],
};

export default recipe;
