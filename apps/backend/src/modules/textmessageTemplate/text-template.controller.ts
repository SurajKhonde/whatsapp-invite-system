import { Request, Response } from "express";

import { logger } from "@core/logger/logger";

import {
  textTemplateRepository,
} from "./text-template.service.ts";

export class TextTemplateController {

  async create(
    req: Request,
    res: Response
  ) {
    try {
      const {
        title,
        category,
        textContent,
        description,
      } = req.body;

      if (
        !title ||
        !category ||
        !textContent
      ) {
        return res.status(400).json({
          success: false,
          error:
            "title, category and textContent are required",
        });
      }

      const result =
        await textTemplateRepository.createTemplate({
          title,
          category,
          textContent,
          description,
        });

      return res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error(
        { error },
        "❌ Create template failed"
      );

      return res.status(
        error.statusCode || 500
      ).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * ============================================
   * GET ALL TEMPLATES
   * ============================================
   */
  async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const result =
        await textTemplateRepository.getAllTemplates();

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error(
        { error },
        "❌ Get all templates failed"
      );

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * ============================================
   * GET TEXT TEMPLATES
   * ============================================
   */
  async getTextTemplates(
    req: Request,
    res: Response
  ) {
    try {
      const result =
        await textTemplateRepository.getTextTemplates();

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error(
        { error },
        "❌ Get text templates failed"
      );

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * ============================================
   * GET IMAGE TEMPLATES
   * ============================================
   */
  async getImageTemplates(
    req: Request,
    res: Response
  ) {
    try {
      const result =
        await textTemplateRepository.getImageTemplates();

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error(
        { error },
        "❌ Get image templates failed"
      );

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * ============================================
   * GET CATEGORIES
   * ============================================
   */
  async getCategories(
    req: Request,
    res: Response
  ) {
    try {
      const result =
        await textTemplateRepository.getCategories();

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error(
        { error },
        "❌ Get categories failed"
      );

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * ============================================
   * GET BY CATEGORY
   * ============================================
   */
  async getByCategory(
    req: Request,
    res: Response
  ) {
    try {
      const categoryParam =
  req.params.category;

const category =
  Array.isArray(categoryParam)
    ? categoryParam[0]
    : categoryParam;

      const result =
        await textTemplateRepository.getTemplatesByCategory(
          category
        );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error(
        { error },
        "❌ Get category templates failed"
      );

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * ============================================
   * GET SINGLE TEMPLATE
   * ============================================
   */
  async getById(
    req: Request,
    res: Response
  ) {
    try {
     const idParam =
  req.params.id;

const id =
  Array.isArray(idParam)
    ? idParam[0]
    : idParam;
      const result =
        await textTemplateRepository.getTemplateById(
          id
        );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error(
        { error },
        "❌ Get template failed"
      );

      return res.status(
        error.statusCode || 500
      ).json({
        success: false,
        error: error.message,
      });
    }
  }

  /**
   * ============================================
   * DELETE TEMPLATE
   * ============================================
   */
  async delete(
    req: Request,
    res: Response
  ) {
    try {
      const idParam =
  req.params.id;

const id =
  Array.isArray(idParam)
    ? idParam[0]
    : idParam;
      await textTemplateRepository.deleteTemplate(
        id
      );

      return res.status(200).json({
        success: true,
        message:
          "Template deleted successfully",
      });
    } catch (error: any) {
      logger.error(
        { error },
        "❌ Delete template failed"
      );

      return res.status(
        error.statusCode || 500
      ).json({
        success: false,
        error: error.message,
      });
    }
  }
}

export const textTemplateController =
  new TextTemplateController();