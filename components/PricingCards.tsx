"use client";

import { useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";

type Feature = { text: string; included: boolean };

type Plan = {
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  currency: string;
  period: string;
  cta: string;
  highlight: boolean;
  features: Feature[];
};

type PricingData = {
  toggle: { monthly: string; yearly: string; saveBadge: string };
  mostPopular: string;
  plans: Plan[];
  cta: { title: string; subtitle: string; button: string };
};

export default function PricingCards({
  data,
  locale,
}: {
  data: PricingData;
  locale: string;
}) {
  const [yearly, setYearly] = useState(false);

  return (
    <>
      {/* Toggle */}
      <div className="flex items-center justify-center gap-4 mb-14">
        <span
          className={`text-sm font-medium ${!yearly ? "text-gray-900" : "text-gray-400"}`}
        >
          {data.toggle.monthly}
        </span>
        <button
          onClick={() => setYearly(!yearly)}
          className={`relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none ${
            yearly ? "bg-[#009fe1]" : "bg-gray-200"
          }`}
          aria-label="Toggle billing period"
        >
          <span
            className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-300 ${
              yearly ? "translate-x-7" : "translate-x-0"
            }`}
          />
        </button>
        <span
          className={`text-sm font-medium flex items-center gap-2 ${yearly ? "text-gray-900" : "text-gray-400"}`}
        >
          {data.toggle.yearly}
          <span className="inline-block bg-[#cae4f2]/40 text-[#007cb5] text-xs font-semibold px-2 py-0.5 rounded-full">
            {data.toggle.saveBadge}
          </span>
        </span>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {data.plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl p-8 flex flex-col transition-all duration-300 ${
              plan.highlight
                ? "bg-[#2e435e] text-white shadow-2xl shadow-[#2e435e]/25 scale-105"
                : "bg-white border border-gray-100 text-gray-900 hover:border-[#cae4f2] hover:shadow-xl hover:shadow-[#009fe1]/10"
            }`}
          >
            {plan.highlight && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-[#009fe1] text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                {data.mostPopular}
              </span>
            )}

            {/* Plan name & description */}
            <div className="mb-6">
              <h3
                className={`text-xl font-bold mb-2 ${plan.highlight ? "text-white" : "text-gray-900"}`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-sm leading-relaxed ${plan.highlight ? "text-white/80" : "text-gray-500"}`}
              >
                {plan.description}
              </p>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-end gap-1">
                {plan.currency && (
                  <span
                    className={`text-2xl font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}
                  >
                    {plan.currency}
                  </span>
                )}
                <span
                  className={`text-5xl font-extrabold tracking-tight ${plan.highlight ? "text-white" : "text-gray-900"}`}
                >
                  {yearly ? plan.yearlyPrice : plan.monthlyPrice}
                </span>
              </div>
              {plan.period && (
                <p
                  className={`text-sm mt-1 ${plan.highlight ? "text-white/60" : "text-gray-400"}`}
                >
                  {plan.period}
                </p>
              )}
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-10 flex-1">
              {plan.features.map((feature) => (
                <li key={feature.text} className="flex items-center gap-3">
                  {feature.included ? (
                    <span
                      className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        plan.highlight ? "bg-white/20" : "bg-[#e8f4fb]"
                      }`}
                    >
                      <svg
                        className={`w-3 h-3 ${plan.highlight ? "text-white" : "text-[#009fe1]"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                  ) : (
                    <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center bg-gray-100">
                      <svg
                        className="w-3 h-3 text-gray-300"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </span>
                  )}
                  <span
                    className={`text-sm ${
                      feature.included
                        ? plan.highlight
                          ? "text-white"
                          : "text-gray-700"
                        : "text-gray-300"
                    }`}
                  >
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Link
              href={`/${locale}/contact`}
              onClick={() => track("pricing_cta_clicked", { plan: plan.name, billing: yearly ? "yearly" : "monthly" })}
              className={`block text-center py-3.5 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                plan.highlight
                  ? "bg-white text-[#009fe1] hover:bg-[#e8f4fb] shadow-md"
                  : "bg-[#009fe1] text-white hover:bg-[#007cb5] shadow-sm"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="mt-20 text-center max-w-xl mx-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-3">{data.cta.title}</h3>
        <p className="text-gray-500 text-sm mb-6">{data.cta.subtitle}</p>
        <Link
          href={`/${locale}/contact`}
          className="inline-block bg-[#009fe1] hover:bg-[#007cb5] text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200 shadow-sm"
        >
          {data.cta.button}
        </Link>
      </div>
    </>
  );
}
