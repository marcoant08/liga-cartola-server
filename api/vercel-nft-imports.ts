/**
 * Imports só para o file tracer da Vercel (@vercel/nft) incluir node_modules no bundle.
 * O handler real carrega api/_nest_dist/vercel.js, que faz require() desses pacotes em runtime.
 */
import 'reflect-metadata';
import 'express';
import 'serverless-http';
import 'rxjs';
import '@nestjs/common';
import '@nestjs/core';
import '@nestjs/platform-express';
import '@nestjs/config';
import '@nestjs/jwt';
import '@nestjs/mongoose';
import '@nestjs/passport';
import '@nestjs/swagger';
import 'bcrypt';
import 'class-transformer';
import 'class-validator';
import 'mongoose';
import 'nodemailer';
import 'passport';
import 'passport-jwt';
