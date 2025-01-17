// app/api/articles/[slug]/route.ts
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import fs from "fs";
import { createClient } from '@/utils/supabase/server';
import { injectArticlePageData } from '@/lib/injectArticlePageData';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // First try to get from database.json
    const existingData = JSON.parse(
      fs.existsSync("database.json")
        ? fs.readFileSync("database.json", "utf-8")
        : "{}"
    );

    const articlePath = `/articles/${params.slug}`;
    if (existingData[articlePath]) {
      return NextResponse.json(existingData[articlePath]);
    }

    // If not in database.json, get from Supabase and inject
    const supabase = await createClient();
    const { data: article, error } = await supabase
      .from('articles')
      .select(`
        *,
        author:author_id(
          id,
          pen_name,
          avatar_url
        ),
        engagement:article_engagement(*)
      `)
      .eq('slug', params.slug)
      .single();

    if (error || !article) {
      return new NextResponse('Article not found', { status: 404 });
    }

    const pageData = await injectArticlePageData(params.slug, article);

    // Save to database.json
    const updatedData = {
      ...existingData,
      [articlePath]: pageData
    };
    fs.writeFileSync("database.json", JSON.stringify(updatedData, null, 2));

    return NextResponse.json(pageData);
  } catch (error) {
    console.error('Error in article API:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const payload = await request.json();
    const articlePath = `/articles/${params.slug}`;

    const existingData = JSON.parse(
      fs.existsSync("database.json")
        ? fs.readFileSync("database.json", "utf-8")
        : "{}"
    );

    const updatedData = {
      ...existingData,
      [articlePath]: payload.data,
    };

    fs.writeFileSync("database.json", JSON.stringify(updatedData, null, 2));

    // Purge Next.js cache
    revalidatePath(articlePath);

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error('Error saving article:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}