const { Portfolio, PortfolioSection } = require("../models");

// Create Portfolio (Admin assigning to Client)
exports.createPortfolio = async (req, res) => {
  try {
    const {
      userId,
      templateId,
      slug,
      primaryColor,
      secondaryColor,
      fontFamily,
      secondaryTextColor,
      logoUrl,
      logoPosition,
      profession,
      location,
      email,
      socialLinks,
      courses,
      projects,
      experience,
      skills,
    } = req.body;

    // Check if slug is taken
    const existing = await Portfolio.findOne({ where: { slug } });
    if (existing)
      return res.status(400).json({ message: "Slug already taken" });

    const portfolio = await Portfolio.create({
      userId,
      templateId,
      slug,
      primaryColor: primaryColor || "#000000",
      secondaryColor: secondaryColor || "#ffffff",
      fontFamily: fontFamily || "Inter",
      secondaryTextColor: secondaryTextColor || "#555555",
      logoUrl: logoUrl || "",
      logoPosition: logoPosition || "left",
      profession: profession || "",
      location: location || "",
      email: email || "",
      socialLinks: socialLinks || {},
      courses: courses || [],
      projects: projects || [],
      experience: experience || [],
      skills: skills || [],
    });

    res.status(201).json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Portfolios for Admin or Logged-in Client
exports.getPortfolios = async (req, res) => {
  try {
    let portfolios;
    if (req.user.role === "ADMIN") {
      portfolios = await Portfolio.findAll();
    } else {
      portfolios = await Portfolio.findAll({ where: { userId: req.user.id } });
    }
    res.json(portfolios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single Portfolio by Slug (Public)
exports.getPortfolioBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const portfolio = await Portfolio.findOne({
      where: { slug },
    });

    if (!portfolio)
      return res.status(404).json({ message: "Portfolio not found" });

    const sections = await PortfolioSection.findAll({
      where: { portfolioId: portfolio.id },
      order: [["order", "ASC"]],
    });

    res.json({ portfolio, sections });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Portfolio basic info (colors, slug, templateId)
exports.updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      primaryColor,
      secondaryColor,
      fontFamily,
      templateId,
      secondaryTextColor,
      logoUrl,
      logoPosition,
      profession,
      location,
      email,
      socialLinks,
      courses,
      projects,
      experience,
      skills,
    } = req.body;

    const portfolio = await Portfolio.findByPk(id);
    if (!portfolio)
      return res.status(404).json({ message: "Portfolio not found" });

    if (portfolio.userId !== req.user.id && req.user.role !== "ADMIN")
      return res.status(403).json({ message: "Unauthorized" });

    // El slug NO se puede cambiar después de creado
    await portfolio.update({
      primaryColor,
      secondaryColor,
      fontFamily,
      templateId,
      secondaryTextColor,
      logoUrl,
      logoPosition,
      profession,
      location,
      email,
      socialLinks,
      courses,
      projects,
      experience,
      skills,
    });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add or Update a Section in a Portfolio
exports.saveSection = async (req, res) => {
  // ...
  try {
    const { portfolioId } = req.params;
    const { id, type, content, order, isVisible } = req.body;

    // verify ownership or admin
    const portfolio = await Portfolio.findByPk(portfolioId);
    if (!portfolio)
      return res.status(404).json({ message: "Portfolio not found" });
    if (portfolio.userId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (id) {
      // update
      const section = await PortfolioSection.findByPk(id);
      if (section) {
        await section.update({ type, content, order, isVisible });
        return res.json(section);
      }
    }

    // create
    const newSection = await PortfolioSection.create({
      portfolioId,
      type,
      content,
      order,
      isVisible: isVisible !== undefined ? isVisible : true,
    });

    res.status(201).json(newSection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
