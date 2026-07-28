const colors = {
    cardBackground: "#4c5059",
    acordionClicked: "#e0e0e09a",
    cardBorder: "#E0E0E0",
    primary: "#1976D2",
    errorBackground: "#a31616",
    errorText: "#D32F2F"
}

const dimensions = {
    cardRadius: 12,
    cardBorderWidth: 1,
    borderWidth: 1,
    defaultPadding: 16,
    smallPadding: 8,
    elevation: 2
}

export const SduiTheme = {
    colors,
    dimensions,
    modifiers: {
        accordion: {
            margin: { horizontal: 16, vertical: 8 },
            corner_radius: dimensions.cardRadius,
            border_width: dimensions.borderWidth,
            border_color: colors.cardBorder,
        },
        accordionHeader: {
            padding: { all: 16 },
            background_color: colors.cardBackground 
        },
        accordionContent: {
            padding: { horizontal: 16, bottom: 16, top: 8 } 
        },
        historyCard: {
            width: { type: "fill" },
            margin: { horizontal: 16, vertical: 8 },
            padding: { all: 16 },
            corner_radius: dimensions.cardRadius,
            border_width: dimensions.borderWidth,
            border_color: colors.cardBorder,
            background_color: colors.cardBackground 
        },
        infoCardProfileDetailed: {
            width: { type: "fill" },
            padding: { all: 16 },
            margin: { bottom: 8},
            corner_radius: dimensions.cardRadius,
            border_width: dimensions.borderWidth,
            border_color: colors.cardBorder,
            background_color: colors.cardBackground
        },
        scheduleCard: {
            width: { type: "exact", value: 200 },
            margin: { end: 8, top: 8, bottom: 8 },
            padding: { all: 12 }, 
            corner_radius: dimensions.cardRadius,
            border_color: colors.cardBorder,
            border_width: dimensions.borderWidth,
            background_color: colors.cardBackground, 
            elevation: dimensions.elevation,
        },
        emptyStateCard: {
            width: { type: "fill" },
            margin: { horizontal: 16, vertical: 8},
            padding : { all: 16 },
            background_color: colors.errorBackground,
            corner_radius: dimensions.cardRadius,
            border_width: dimensions.cardBorderWidth,
            border_color: colors.cardBorder
        },
        infoCard: {
            width: { type: "fill" },
            padding: { all: 10 },
            margin: { start: 8, end: 8},
            corner_radius: dimensions.cardRadius,
            border_width: dimensions.borderWidth,
            border_color: colors.cardBorder,
            background_color: colors.cardBackground
        },
        scoreCard: {
            width: { type: "fill" },
            margin: { horizontal: 16, vertical: 8 },
            padding: { all: 16 },
            corner_radius: dimensions.cardRadius,
            border_width: dimensions.borderWidth,
            border_color: colors.cardBorder,
            background_color: colors.cardBackground
        },
        defaultInput: {
            width: { type: "fill" },
            margin: { horizontal: 16, vertical: 8 }
        },
        sectionHeader: { 
            margin: { start: 12,end: 8},
            padding : { all: 4}
        },
        warningBanner: {
            width: { type: "fill" },
            margin: { horizontal: 16, vertical: 8 },
            padding: { all: 16 },
            corner_radius: dimensions.cardRadius,
            border_width: dimensions.borderWidth,
            border_color: colors.cardBorder,
            background_color: colors.errorBackground
        }
    }
}

