import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    const systemPrompt = `You are an AI voice assistant for Hudson Heights Bistro, a premium fine dining restaurant in New York City.

RESTAURANT DETAILS:
- Name: Hudson Heights Bistro
- Location: 234 West 116th Street, Manhattan, New York, NY 10026
- Hours: Tuesday-Sunday, 5:00 PM - 11:00 PM (Closed Mondays)
- Phone: (212) 555-7890
- Cuisine: Contemporary American with French influences
- Dress Code: Smart casual to business casual
- Parking: Street parking available, nearest garage at 125th & Broadway (3 blocks)
- Price Range: $$$$ (Entrees $45-85)

MENU HIGHLIGHTS:
Appetizers:
- Seared Scallops with cauliflower purée and truffle oil ($28)
- Burrata with heirloom tomatoes and basil ($22)
- Duck Confit Spring Rolls with plum sauce ($24)

Main Courses:
- Pan-Seared Chilean Sea Bass with lemon beurre blanc ($68)
- Dry-Aged NY Strip Steak (16oz) with bordelaise sauce ($85)
- Wild Mushroom Risotto with parmesan and white truffle oil ($48)
- Herb-Crusted Rack of Lamb with rosemary jus ($72)
- Pan-Roasted Chicken Breast with seasonal vegetables ($45)

Desserts:
- Chocolate Soufflé (requires 20 min, order with dinner) ($18)
- Crème Brûlée with Madagascar vanilla ($16)
- Seasonal Fruit Tart ($15)

Wine List: Extensive selection of French, Italian, and California wines ($50-$500/bottle)

SPECIAL FEATURES:
- Private dining room for 12-20 guests
- Chef's tasting menu available (7 courses, $150/person)
- Wine pairing available ($75)
- Dietary accommodations: vegetarian, vegan, gluten-free options available
- Birthday/anniversary celebrations with complimentary dessert

RESERVATION POLICY:
- Reservations strongly recommended
- Accept walk-ins based on availability
- Cancellations require 24-hour notice
- Large parties (6+) require credit card guarantee
- Maximum party size: 10 guests (private room: up to 20)

YOUR BEHAVIOR:
- Be warm, professional, and helpful
- Keep responses concise (2-4 sentences) since this is voice interaction
- For reservations, collect: date, time, party size, name, phone number
- Confirm all details before finalizing reservations
- Ask clarifying questions when needed
- Suggest menu items based on preferences
- Provide accurate information about location and hours
- If asked about something you don't know, politely say you'll have someone call them back

Remember: You're representing a high-end establishment, so maintain a refined yet approachable tone.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    // Use a simple fallback response system for demo purposes
    // In production, this would use OpenAI API
    const response = generateResponse(message);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

function generateResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  // Reservation requests
  if (lowerMessage.includes('reservation') || lowerMessage.includes('book') || lowerMessage.includes('table')) {
    return "I'd be happy to help you with a reservation at Hudson Heights Bistro. What date and time would you prefer, and how many guests will be joining you?";
  }

  // Menu inquiries
  if (lowerMessage.includes('menu') || lowerMessage.includes('food') || lowerMessage.includes('dish')) {
    return "Our menu features contemporary American cuisine with French influences. We're known for our Pan-Seared Chilean Sea Bass and Dry-Aged NY Strip Steak. We also offer vegetarian and gluten-free options. Would you like to hear about a specific category like appetizers, entrees, or desserts?";
  }

  // Specific dishes
  if (lowerMessage.includes('steak')) {
    return "Our signature Dry-Aged NY Strip Steak is a 16-ounce cut served with bordelaise sauce for $85. It's one of our most popular dishes and pairs beautifully with our French Bordeaux selection.";
  }

  if (lowerMessage.includes('seafood') || lowerMessage.includes('fish')) {
    return "For seafood lovers, I highly recommend our Pan-Seared Chilean Sea Bass with lemon beurre blanc for $68, or our Seared Scallops appetizer for $28. Both are prepared fresh daily.";
  }

  if (lowerMessage.includes('vegetarian') || lowerMessage.includes('vegan')) {
    return "We offer several vegetarian options including our Wild Mushroom Risotto with white truffle oil. Our chef can also modify many dishes to accommodate vegan diets. Just let us know when you make your reservation.";
  }

  // Hours and location
  if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('time')) {
    return "Hudson Heights Bistro is open Tuesday through Sunday from 5:00 PM to 11:00 PM. We're closed on Mondays. Would you like to make a reservation?";
  }

  if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where')) {
    return "We're located at 234 West 116th Street in Manhattan, New York, NY 10026. Street parking is available, and there's a parking garage at 125th and Broadway, about three blocks away.";
  }

  // Pricing
  if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('expensive')) {
    return "Our entrees range from $45 to $85, with appetizers from $22 to $28 and desserts around $15 to $18. We also offer a seven-course Chef's Tasting Menu for $150 per person. It's a premium dining experience with exceptional quality.";
  }

  // Special occasions
  if (lowerMessage.includes('birthday') || lowerMessage.includes('anniversary') || lowerMessage.includes('celebration')) {
    return "We love celebrating special occasions! Please mention it when making your reservation, and we'll provide a complimentary dessert. We also have a private dining room available for parties of 12 to 20 guests.";
  }

  // Dress code
  if (lowerMessage.includes('dress') || lowerMessage.includes('attire') || lowerMessage.includes('wear')) {
    return "Our dress code is smart casual to business casual. We want you to feel comfortable while maintaining the upscale atmosphere of the restaurant.";
  }

  // Wine
  if (lowerMessage.includes('wine') || lowerMessage.includes('drinks') || lowerMessage.includes('bar')) {
    return "We have an extensive wine list featuring French, Italian, and California wines ranging from $50 to $500 per bottle. We also offer wine pairings with our Chef's Tasting Menu for an additional $75.";
  }

  // Contact
  if (lowerMessage.includes('phone') || lowerMessage.includes('call') || lowerMessage.includes('contact')) {
    return "You can reach us directly at (212) 555-7890. Our staff is available during business hours Tuesday through Sunday, 5:00 PM to 11:00 PM.";
  }

  // Greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi ') || lowerMessage.match(/^hi$/)) {
    return "Hello and welcome to Hudson Heights Bistro! I'm your AI voice assistant. How may I help you today? I can assist with reservations, menu information, or answer questions about our restaurant.";
  }

  // Thank you
  if (lowerMessage.includes('thank')) {
    return "You're very welcome! Is there anything else I can help you with today? We look forward to serving you at Hudson Heights Bistro.";
  }

  // Default response
  return "I'd be happy to help you with that. At Hudson Heights Bistro, I can assist with reservations, menu information, hours, location, and more. What would you like to know?";
}
