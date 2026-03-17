import React from "react";
import { useCurrentFrame, useVideoConfig } from "../../core";

export interface EmailRow {
  from: string;
  subject: string;
  time: string;
  unread?: boolean;
}

export interface EmailInboxProps {
  /** Custom email rows — uses realistic defaults if not provided */
  emails?: EmailRow[];
  highlightRow?: number;
  scrollOffset?: number;
  searching?: boolean;
  searchQuery?: string;
  /** Customize colors */
  bgColor?: string;
  accentColor?: string;
  style?: React.CSSProperties;
}

const DEFAULT_EMAILS: EmailRow[] = [
  { from: "Pierre Dupont", subject: "Re: Budget Q2 — mise à jour", time: "lun.", unread: true },
  { from: "Sophie Martin", subject: "Compte rendu réunion produit", time: "lun.", unread: false },
  { from: "LinkedIn", subject: "12 nouvelles notifications", time: "lun.", unread: true },
  { from: "JIRA", subject: "[PROJ-142] Sprint review feedback", time: "dim.", unread: true },
  { from: "Marie Leclerc", subject: "Contrat partenariat — V3 signée ✓", time: "sam.", unread: false },
  { from: "Slack", subject: "3 messages non lus dans #product", time: "sam.", unread: true },
  { from: "Thomas Bernard", subject: "Re: Re: Slides investor deck", time: "ven.", unread: false },
  { from: "Google Calendar", subject: "Rappel : Standup demain 9h", time: "ven.", unread: false },
  { from: "Newsletter Tech", subject: "Les 10 tendances IA en 2026", time: "jeu.", unread: true },
  { from: "Figma", subject: "Marie a commenté vos designs", time: "jeu.", unread: false },
  { from: "AWS", subject: "Votre facture de février", time: "mer.", unread: false },
  { from: "Notion", subject: "Mise à jour de la roadmap Q2", time: "mer.", unread: true },
];

export const EmailInbox: React.FC<EmailInboxProps> = ({
  emails,
  highlightRow = -1,
  scrollOffset = 0,
  searching = false,
  searchQuery = "",
  bgColor = "#1a1a2e",
  accentColor = "#3a6fd8",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = emails || DEFAULT_EMAILS;

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: bgColor,
        borderRadius: "0 0 8px 8px",
        overflow: "hidden",
        fontFamily: "system-ui",
        ...style,
      }}
    >
      {/* Search bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 16px",
          backgroundColor: "rgba(0,0,0,0.2)",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 16, color: "#666" }}>🔍</span>
        <div
          style={{
            flex: 1,
            height: 32,
            backgroundColor: searching ? `${accentColor}20` : "rgba(255,255,255,0.05)",
            borderRadius: 8,
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            border: searching ? `1px solid ${accentColor}` : "1px solid transparent",
          }}
        >
          <span style={{ fontSize: 13, color: searching ? "#a0b4d8" : "#556" }}>
            {searching ? searchQuery : "Rechercher dans les emails..."}
          </span>
          {searching && (
            <span
              style={{
                color: accentColor,
                opacity: Math.round(frame / (fps / 3)) % 2 === 0 ? 1 : 0,
              }}
            >
              |
            </span>
          )}
        </div>
      </div>

      {/* Email rows */}
      <div style={{ transform: `translateY(-${scrollOffset}px)` }}>
        {rows.map((email, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              backgroundColor: i === highlightRow ? `${accentColor}20` : "transparent",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: email.unread ? accentColor : "transparent",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                width: 140,
                fontSize: 13,
                fontWeight: email.unread ? 700 : 400,
                color: email.unread ? "#e0e0e0" : "#888",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flexShrink: 0,
              }}
            >
              {email.from}
            </span>
            <span
              style={{
                flex: 1,
                fontSize: 13,
                color: email.unread ? "#c0c0c0" : "#666",
                fontWeight: email.unread ? 600 : 400,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {email.subject}
            </span>
            <span style={{ fontSize: 11, color: "#556", flexShrink: 0 }}>{email.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
