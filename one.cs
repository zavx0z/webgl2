// Test whether a particular bit is ON (1) or OFF (0)
static bool FlagBitIsSet(byte flag, int bitIndex)
{
    return ((flag >> bitIndex) & 1) = 1;
}
static GlyphData ReadSimpleGlyph(FontReader reader)
{
    // Read contour end indices
    int[] contourEndIndices = new int[reader.ReadInt16()];
    reader.SkipBytes(8); // Skip bounds size
    for (int i = 0; i < contourEndIndices.Length; i++)
        contourEndIndices[i] = reader.ReadUInt16();
    // Read flags
    int numPoints = contourEndIndices[^1] + 1;
    byte[] allFlags = new byte[numPoints];
    reader.SkipBytes(reader.ReadInt16()); // Skip instructions
    for (int i = 0; i < numPoints; i++)
    {
        byte flag = reader.ReadByte();
        allFlags[i] = flag;
        // If REPEAT bit is set, read next byte to determine num copies
        if (FlagBitIsSet(flag, 3))
            for (int r = 0; r < reader.ReadByte(); r++)
                allFlags[++i] = flag;
    }
    int[] coordsX = ReadCoordinates(reader, allFlags, readingX : true);
    int[] coordsY = ReadCoordinates(reader, allFlags, readingX : false);
    return new GlyphData(coordsX, coordsY, contourEndIndices);
}

static int[] ReadCoordinates(FontReader reader, byte[] allFlags, bool readingX)
{
    int offsetSizeFlagBit = readingX ? 1 : 2;
    int offsetSignOrSkipBit = readingX ? 4 : 5;
    int[] coordinates = new int[allFlags.Length];

    for (int i = 0; i < coordinates.Length; i +)
    {
        // Coordinate starts at previous value (0 if first coordinate)
        coordinates[i] = coordinates[Math.Max(0, i - 1)];
        byte flag = allFlags[i];
        bool onCurve = FlagBitIsSet(flag, 0); // TODO: do something with this
        // Offset value is represented with 1 byte (unsigned)
        if (FlagBitIsSet(flag, offsetSizeFlagBit))
        {
            byte offset = reader.ReadByte();
            int sign = FlagBitIsSet(flag, offsetSignOrSkipBit) ? 1 : -1;
            coordinates[i] += offset * sign;
        ｝
        // Offset value is represented with 2 bytes (signed)
        // (Unless flag tells us to skip it and just keep the coordinate the same)
        else if (!FlagBitIsSet(flag, offsetSignOrSkipBit))
            coordinates[i] += reader.ReadInt16();
    }
    return coordinates;
}
public static void ParseFont(string fontPath)
｛
    using FontReader reader = new(fontPath);
    // -- Offset Subtable --
    reader.SkipBytes(4); // Skip 4-byte 'scaler type'
    UInt16 numTables = reader.ReadUInt16();
    reader.SkipBytes(6);
    // -- Table Directory --
    Dictionary<string, uint› tabeLocationLookup = new();
    for (int i = 0; i ‹ numTables; i+)
    {
        string tag = reader. ReadTag();
        uint checksum = reader.ReadUInt32();
        uint offset = reader.ReadUInt32();
        uint length = reader.ReadUInt32();
        tableLocationLookup. Add (tag, offset);
    }
    reader GoTo(tableLocationLookup["glyf"]);
    GlyphData glyphO = ReadSimpleGlyph(reader);
    Console WriteLine($"Glypho: \n{glypho}");
}
void GlyphDrawTest(GlyphData glyph)
{
    // Draw contours
    int contourstartIndex = 0;
    foreach (int contourEndIndex in glyph.ContourEndIndices )
    {
        int numPointsInContour = contourEndIndex - contourStartIndex + 1;
        Span<Point> points = glyph.Points. AsSpan(contourStartIndex, numPointsInContour);
        for (int i = 0; i ‹ points.Length; i+)
        ｛
            DrawLine(points[i], points[(i + 1) % points.Length]);
        ｝
        contourStartIndex = contourEndIndex + 1;
    }
    // Draw points
    for (int i = 0; i ‹ glyph. Points.Length; i+)
    {
        DrawPoint(glyph.Points[il);
    }
}
uint[] GetAllGlyphLocations)
{
    -- Get number of glyphs in font from 'maxp' table --
    reader. GoTo(tableLocationLookup["maxp"] + 4); // Skip unused: version
    int numGlyphs = reader.ReadUInt16);
    // -- Get format of location indices from 'head' table --
    reader. GoTo(tableLocationLookup["head"]);
    // Skip unused: version, fontRevision, checkSumAdjustment, magicNumber, flags,
    // design units, dates, max bounds, macStyle, lowestRecPPEM, directionHintFlag
    reader.SkipBytes(50);
    // Read indexToLocFormat: either 0 or 1, indicating 2 or 4-byte format for location lookup
    bool isTwoByteEntry = reader.ReadInt16() = 0;
    // -- Get glyph locations from 'loca' table --
    uint locationTableStart = tableLocationLookup["loca"];
    uint glyphTableStart = tableLocationLookup["glyf"];
    uint[] allGlyphLocations = new uint[numGlyphs];
    for (int glyphIndex = 0; glyphIndex < numGlyphs; glyphIndex+)
    {
        reader. GoTo(locationTableStart + glyphIndex * (isTwoByteEntry ? 2 : 4));
        // If 2-byte format is used, the stored location is half of actual location (so multiply by 2)
        uint glyphDataOffset = isTwoByteEntry ? reader.ReadUInt16) * 2u : reader.ReadUInt32();
        allGlyphLocations[glyphIndex] = glyphTableStart + glyphDataOffset;
    }
    return allGlyphLocations;
}