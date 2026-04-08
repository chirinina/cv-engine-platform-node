const { Portfolio, PortfolioInquiry } = require("../models");

const trimValue = (value) => (typeof value === "string" ? value.trim() : "");

exports.createInquiry = async (req, res) => {
  try {
    const { slug } = req.params;
    const senderName = trimValue(req.body.senderName);
    const projectName = trimValue(req.body.projectName);
    const projectDescription = trimValue(req.body.projectDescription);
    const phone = trimValue(req.body.phone);

    if (!senderName || !projectName || !projectDescription) {
      return res.status(400).json({
        message: "El nombre, el nombre del proyecto y la descripcion son obligatorios",
      });
    }

    const portfolio = await Portfolio.findOne({ where: { slug } });
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    const inquiry = await PortfolioInquiry.create({
      portfolioId: portfolio.id,
      senderName: senderName.slice(0, 120),
      projectName: projectName.slice(0, 160),
      projectDescription: projectDescription.slice(0, 2000),
      phone: phone ? phone.slice(0, 40) : null,
    });

    res.status(201).json({
      message: "Consulta enviada correctamente",
      inquiry,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPortfolioInquiries = async (req, res) => {
  try {
    const include = {
      model: Portfolio,
      as: "portfolio",
      attributes: ["id", "slug", "userId", "email", "profession"],
      required: true,
    };

    if (req.user.role !== "ADMIN") {
      include.where = { userId: req.user.id };
    }

    const inquiries = await PortfolioInquiry.findAll({
      include: [include],
      order: [["createdAt", "DESC"]],
    });

    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
