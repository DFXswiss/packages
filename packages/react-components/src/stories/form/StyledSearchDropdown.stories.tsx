import { ComponentMeta, ComponentStory } from "@storybook/react";
import { useForm } from "react-hook-form";
import Form from "./Form";
import StyledSearchDropdown from "./StyledSearchDropdown";

interface Country {
  symbol: string;
  name: string;
}

export default {
  title: "Forms/StyledSearchDropdown",
  component: StyledSearchDropdown,
} as ComponentMeta<typeof StyledSearchDropdown>;

export const CountrySelect: ComponentStory<typeof StyledSearchDropdown<Country>> = (args) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ test: string }>();

  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <div className="p-10 max-w-xl bg-white">
      <Form control={control} errors={errors} onSubmit={onSubmit}>
        <StyledSearchDropdown {...args} name="test" />
      </Form>
    </div>
  );
};
CountrySelect.args = {
  label: "Country",
  placeholder: "Select...",
  items: [
    { symbol: "CH", name: "Switzerland" },
    { symbol: "DE", name: "Germany" },
  ],
  labelFunc: (i) => i.name,
  descriptionFunc: (i) => i.symbol,
  filterFunc: (i, search) => !search || [i.name, i.symbol].some((w) => w.toLowerCase().includes(search.toLowerCase())),
  matchFunc: (i, search) => search.toLowerCase() === i.name.toLowerCase(),
};
