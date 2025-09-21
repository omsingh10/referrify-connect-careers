import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X, Clock, TrendingUp } from "lucide-react";

interface SearchResult {
  id: string;
  title: string;
  type: "job" | "user" | "company";
  description: string;
  tags?: string[];
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ onSearch, placeholder = "Search jobs, companies, users..." }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "Software Engineer",
    "Data Science",
    "React Developer"
  ]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: "1",
      title: "Software Engineer Intern",
      type: "job",
      description: "TechCorp • San Francisco, CA",
      tags: ["React", "JavaScript", "Node.js"]
    },
    {
      id: "2",
      title: "Data Science Intern",
      type: "job",
      description: "DataFlow Inc • New York, NY",
      tags: ["Python", "Machine Learning", "SQL"]
    },
    {
      id: "3",
      title: "Sarah Chen",
      type: "user",
      description: "Senior Software Engineer at TechCorp",
      tags: ["Alumni", "Mentor"]
    },
    {
      id: "4",
      title: "TechCorp",
      type: "company",
      description: "Leading technology company in San Francisco",
      tags: ["Tech", "Startup"]
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Filter mock results based on query
      const filtered = mockResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setResults(filtered);
      
      // Add to recent searches if not already there
      if (!recentSearches.includes(searchQuery)) {
        setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
      }
      
      onSearch?.(searchQuery);
    } else {
      setResults([]);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsOpen(true);
    
    // Debounced search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery(result.title);
    setIsOpen(false);
    onSearch?.(result.title);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "job":
        return "💼";
      case "user":
        return "👤";
      case "company":
        return "🏢";
      default:
        return "🔍";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "job":
        return "bg-primary/10 text-primary";
      case "user":
        return "bg-success/10 text-success";
      case "company":
        return "bg-warning/10 text-warning";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10 pr-10 h-12 text-base"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-2 shadow-lg">
          <CardContent className="p-0 max-h-96 overflow-y-auto">
            {query && results.length > 0 && (
              <div className="p-3 border-b">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Search Results</h4>
                <div className="space-y-2">
                  {results.map((result) => (
                    <div
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="flex items-start space-x-3 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <span className="text-lg">{getTypeIcon(result.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium truncate">{result.title}</p>
                          <Badge variant="outline" className={`text-xs ${getTypeColor(result.type)}`}>
                            {result.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{result.description}</p>
                        {result.tags && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {result.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!query && recentSearches.length > 0 && (
              <div className="p-3 border-b">
                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Recent Searches
                </h4>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setQuery(search);
                        handleSearch(search);
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{search}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3">
              <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                Popular Searches
              </h4>
              <div className="flex flex-wrap gap-2">
                {["React Developer", "Data Scientist", "Product Manager", "UX Designer"].map((term) => (
                  <Badge
                    key={term}
                    variant="outline"
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => {
                      setQuery(term);
                      handleSearch(term);
                      setIsOpen(false);
                    }}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};