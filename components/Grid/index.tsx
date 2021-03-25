import { TemplateCard } from '../GridCard';
import { Template } from '../../services/templates';
import { Container } from './Grid.styled';

type Props = {
  items: Template[];
  isLoading?: boolean;
  isUsersTemplates?: boolean;
};

const Grid = ({ isLoading, items, isUsersTemplates }: Props): JSX.Element => {
  return (
    <Container>
      {items.map((item) => (
        <TemplateCard
          key={item['template_id']}
          {...(item as Template)}
          isLoading={isLoading}
          isUsersTemplates={isUsersTemplates}
        />
      ))}
    </Container>
  );
};

export default Grid;
