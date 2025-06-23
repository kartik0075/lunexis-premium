import { useSession } from "next-auth/react";
"use client";

import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { updateDoc, doc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { FeedContent } from "../types/feed";
import { ContentCard } from "./content-card";
import { MoodFilter } from "./mood-filter";
import { Button } from "@/components/ui/button";
import { Sparkles, Filter } from "lucide-react";

export function HomeFeed() {
  const { data: session } = useSession();
  const uid = session?.user?.id;

  const [feedData, setFeedData] = useState<FeedContent[]>([]);
  const [filteredData, setFilteredData] = useState<FeedContent[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "posts"));
        const posts: FeedContent[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FeedContent[];

        setFeedData(posts);
        setFilteredData(posts);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = feedData;

    if (selectedMoods.length > 0) {
      filtered = filtered.filter((content) =>
        content.moodTags?.some((tag) => selectedMoods.includes(tag))
      );
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((content) =>
        selectedTypes.includes(content.type)
      );
    }

    setFilteredData(filtered);
  }, [selectedMoods, selectedTypes, feedData]);

  if (isLoading) return <p className="text-center mt-10">Loading posts...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5" /> Lunexis Feed
        </h1>
        <Button onClick={() => setShowFilters(!showFilters)} variant="outline">
          <Filter className="w-4 h-4 mr-2" /> Filters
        </Button>
      </div>

      {showFilters && (
        <MoodFilter
          selectedMoods={selectedMoods}
          setSelectedMoods={setSelectedMoods}
          selectedTypes={selectedTypes}
          setSelectedTypes={setSelectedTypes}
        />
      )}

      {filteredData.length === 0 ? (
        <p className="text-center text-gray-500">No posts found.</p>
      ) : (
        filteredData.map((post) => <ContentCard key={post.id} {...post} />)
      )}
    </div>
  );
}
