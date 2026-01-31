import { NextResponse } from 'next/server';
import { TATTOO_STYLES } from '@/components/Tattoo-Styles/config';
import { TATTOO_COLORS } from '@/components/Tattoo Colors/config';

export async function POST(req: Request) {
  try {
    const { prompt, style, color, ratio } = await req.json();

    const apiKey = process.env.DIFY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'DIFY_API_KEY is not set' },
        { status: 500 }
      );
    }

    // Determine if custom style/color is used
    // We use the shared config to determine valid "known" values
    const knownStyles = TATTOO_STYLES.filter(s => !s.isCustom).map(s => s.value);
    const knownColors = TATTOO_COLORS.filter(c => !c.isCustom).map(c => c.value);

    const isCustomStyle = style && !knownStyles.includes(style);
    const isCustomColor = color && !knownColors.includes(color);

    // Map inputs to Dify's expected format
    const inputs = {
      style: isCustomStyle ? "Custom Style" : (style || "Neo Traditional"),
      color: isCustomColor ? "Custom Color" : (color || "Black"),
      aspect_ratio: ratio || "1:1",
      prompt: prompt,
      CustomStyle: isCustomStyle ? style : "",
      CustomColor: isCustomColor ? color : "",
    };

    const payload = {
      inputs,
      response_mode: 'blocking',
      user: 'user-123',
    };

    console.log('Sending request to Dify:', JSON.stringify(payload, null, 2));

    const response = await fetch('https://api.dify.ai/v1/workflows/run', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dify API Error:', response.status, errorText);
      return NextResponse.json(
        { error: `Dify Error: ${errorText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Dify Response Data:', JSON.stringify(data, null, 2));
    return NextResponse.json(data);

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: String(error) },
      { status: 500 }
    );
  }
}
