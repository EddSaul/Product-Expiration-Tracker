import * as React from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FormControl } from "@/components/ui/form";
import { useDebounce } from "@/hooks/useDebounce";

export interface Option {
  id: number | string;
  name: string;
}

interface SearchableSelectProps {
  value?: string;
  onSelect: (value: string) => void;
  onSearch?: (query: string) => Promise<Option[]>; // Optional for async search
  options?: Option[]; // For synchronous mode
  initialOptions?: Option[]; // For async mode (default values)
  placeholder?: string;
  emptyText?: string;
  disabled?: boolean;
}

export function SearchableSelect({
  value,
  onSelect,
  onSearch,
  options: propOptions, // If direct options are passed
  initialOptions = [],
  placeholder = "Seleccionar...",
  emptyText = "No encontrado.",
  disabled = false,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  
  // Internal state for options (combines props or local state)
  const [internalOptions, setInternalOptions] = React.useState<Option[]>(propOptions || initialOptions);
  
  const [loading, setLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  
  // State for the text displayed on the button
  const [selectedName, setSelectedName] = React.useState<string>("");

  const debouncedSearch = useDebounce(inputValue, 300);

  // Synchronize external options when they change (Autocomplete)
  React.useEffect(() => {
    if (propOptions) {
        setInternalOptions(propOptions);
    } else if (initialOptions.length > 0) {
        setInternalOptions(initialOptions);
    }
  }, [propOptions, initialOptions]);

  // Update the displayed name when the value or options change
  React.useEffect(() => {
    if (value) {
      // Search in the available options
      const found = internalOptions.find(o => o.id.toString() === value.toString());
      if (found) {
        setSelectedName(found.name);
      } else {
        setSelectedName(""); // Reset if not found
      }
    } else {
      setSelectedName(""); // Reset if the value is cleared
    }
  }, [value, internalOptions]);

  // Async Search (if onSearch exists)
  React.useEffect(() => {
    if (!open || !onSearch) return;
    
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const results = await onSearch(debouncedSearch);
        setInternalOptions(results);
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [debouncedSearch, open, onSearch]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between font-normal",
              !selectedName && "text-muted-foreground"
            )}
          >
            {selectedName || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command shouldFilter={!onSearch}> {/* If there is server-side search, disable local filtering */}
          <CommandInput 
            placeholder={`Buscar...`} 
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
             {loading && (
                <div className="py-6 text-center text-sm text-muted-foreground flex justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" /> Buscando...
                </div>
             )}
             
             {!loading && internalOptions.length === 0 && (
                <CommandEmpty>{emptyText}</CommandEmpty>
             )}

             {!loading && (
                <CommandGroup className="max-h-[200px] overflow-y-auto">
                  {internalOptions.map((option) => (
                    <CommandItem
                      key={option.id}
                      value={option.name} 
                      onSelect={() => {
                        onSelect(option.id.toString());
                        setSelectedName(option.name); 
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === option.id.toString() ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
             )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}