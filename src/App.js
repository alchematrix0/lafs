import React, { Component } from 'react';
import './App.css';
import { Columns, Hero, Card, Media, Modal, Section, Heading, Form, Button, Container } from 'react-bulma-components/full';
import { Field, Control, Label, Input, Select, Help } from 'react-bulma-components/lib/components/form';
let imgLink = `https://www.lillooetagricultureandfood.org/wp-content/uploads/2018/09`;
const defaultImgs = {
  'production': `${imgLink}/production.jpg`,
  'important-contacts': `${imgLink}/important-contacts.jpg`,
  'plans-regulations': `${imgLink}/plans-and-regulations-.jpeg`,
  'education-learning': `${imgLink}/education-and-learning.jpg`,
  'sales-distribution': `${imgLink}/sales-and-distribution-e1539188766340.jpg`,
  'funding': `${imgLink}/funding.jpg`,
  'finances': `${imgLink}/finances-e1537891078909.jpg`,
  'finances2': `${imgLink}/finances-e1537891078909.jpg`,
  'operations': `${imgLink}/operations.jpg`,
  'marketing': `${imgLink}/marketing.jpg`,
  'production2': `${imgLink}/production2.jpg`,
  'important-contacts2': `${imgLink}/important-contacts2.jpg`,
  'plans-regulations2': `${imgLink}/plans-and-regulations2-e1537890970792.jpg`,
  'education-learning2': `${imgLink}/education-and-learning2.jpg`,
  'sales-distribution2': `${imgLink}/sales-and-distribution2-e1539188566494.jpg`,
  'funding2': `${imgLink}/funding2.jpg`,
  'operations2': `${imgLink}/operations2.jpg`,
  'marketing2': `${imgLink}/marketing2.jpg`,
}

const HoC = Component => {
  class Controlled extends React.Component {
    static displayName = 'Select';
    state = {
      value: '',
    };
    onChange = evt => {
      this.setState({
        value: evt.target.value,
      });
    };
    render() {
      return <Component onChange={this.onChange} value={this.state.value} {...this.props} />;
    }
  }
  return Controlled;
};
const SelectControlled = HoC(Select);

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      keywords: [],
      category: [],
      commodity: [],
      searchInput: '',
      categories: [],
      subcategories: [],
      commodities: [],
      resources: [],
      show: false
    }
  }
  returnToTop = () => window.scrollTo(0, 360)
  handleSearchInput = (e) => this.setState({searchInput: e.target.value})
  toggleCategory = (e) => this.setState({ category: e.target.checked ? this.state.category.concat([e.target.name]) : this.state.category.filter(v => v !== e.target.name) })
  toggleCommodity = (e) => this.setState({ commodity: e.target.checked ? this.state.commodity.concat([e.target.name]) : this.state.commodity.filter(v => v !== e.target.name) })
  static getDerivedStateFromProps (props, prevState) {
    if (!props.resources) {
      return null
    } else {
      let data = props.resources.map(d => Object.assign({category: '', subcategory: '', commodity: ''}, d))
      let db = data.map(d => Object.assign(d, {
        terms: d.keys.split(',').concat([d.resource, d.organization, d.category, d.web_link, d.subcategory]).map(t => t.trim().toLowerCase()),
        category: d.category.toLowerCase().trim(),
        subcategory: d.subcategory.toLowerCase().trim(),
        commodity: d.commodity.toLowerCase().trim(),
        img: d.img || defaultImgs[Math.random() > 0.5 ? `${d.category.toLowerCase().trim().replace(' & ', '-').replace(' ', '-')}` : `${d.category.toLowerCase().trim().replace(' & ', '-').replace(' ', '-')}2`]
      }))
      return {
        categories: Array.from(new Set(db.map(resource => resource.category).concat(db.map(resource => resource.subcategory)))),
        subcategories: Array.from(new Set(db.map(resource => resource.subcategory))),
        commodities: Array.from(new Set(db.filter(d => d.commodity !== 'All' && d.commodity !== 'all').map(resource => resource.commodity))),
        resources: db
      }
    }
  }
  applyFilters = (resources) => resources.filter(resource => {
    if (this.state.searchInput.length && !resource.terms.some(t => t.includes(this.state.searchInput.toLowerCase()))) {
      return false
    }
    let cats = [resource.category, resource.subcategory]
    let {category, commodity} = this.state
    return (
      // if no category or commodity selected return true for all resources that have passed search input filter
      (!category.length && !commodity.length) ||
      // or, if we have checkbox selections
        // first option: we have a category and a commodity, they must both match to return true
      (category.length && commodity.length && category.every(c => cats.includes(c)) && commodity.every(c => resource.commodity === c || resource.commodity === 'all')) ||
        // second option: we have no category and a commodity
      (!category.length && commodity.length && commodity.every(c => resource.commodity === c  || resource.commodity === 'all')) ||
        // third option: we have no commodity and a category
      (!commodity.length && category.length && category.every(c => cats.includes(c)))
      // (this.state.searchInput.length && resource.keys.split(',').map(t => t.trim()).some(k => k.toLowerCase().includes(this.state.searchInput)))
    )
  })
  renderResources = () => {
    return this.state.category.length > 2 || this.state.commodity.length > 1 ? <h3 style={{marginTop: '1em'}}>No matches found. Ease up on the throttle cowboy.</h3> :
    this.applyFilters(this.state.resources).map((resource, index) => {
      let breadcrumbs = resource.category !== resource.subcategory ? [{name: resource.category, url: 'some-link', key : index}, {name: resource.subcategory, url: '', key : index + '1'}] : [{name: resource.category, url: 'some-link', key : index}]
      return (
        <Columns.Column size={4} key={resource.web_link + '_' + index}>
          <a href={resource.web_link} target='_blank' rel='noopener noreferrer'>
            <Card>
              <Card.Image style={{height: 'auto'}} src={resource.img} />
              <Card.Content>
                <Media>
                  <Media.Item>
                    <Heading className='resource-title' style={{color: '#77b749', textTransform: 'capitalize', letterSpacing: 0}} size={5}>
                      <p style={{color: '#77b749', textDecoration: 'none', fontFamily: 'Arial', letterSpacing: 0}} target='_blank'>{resource.resource}</p>
                    </Heading>
                    <Heading subtitle style={{color: 'black', textTransform: 'capitalize', fontFamily: 'Arial'}} size={6}>
                      {resource.organization}
                    </Heading>
                  </Media.Item>
                </Media>
                <div style={{textTransform: 'capitalize', fontSize: '0.8rem'}}>
                  {breadcrumbs.map((b, i) => i > 0 ? <span key={b.key}> / {b.name}</span> : <span key={b.key}>{b.name}</span>)}
                </div>
              </Card.Content>
            </Card>
          </a>
        </Columns.Column>
      )
    })
  }
  renderResourcesPin = () => {
    return this.state.category.length > 2 || this.state.commodity.length > 1 ? <h3>No matches possible, relax your sphincter!</h3> :
    this.applyFilters(this.state.resources).map((resource, index) => {
      let breadcrumbs = resource.category !== resource.subcategory ? [{name: resource.category, url: 'some-link', key : index}, {name: resource.subcategory, url: '', key : index + '1'}] : [{name: resource.category, url: 'some-link', key : index}]
      return (
        <Columns.Column size={4} className='rsr' style={{height: 'auto', width: '31%', margin: '1%', padding: '10px'}} key={resource.web_link + '_' + index}>
          <Card>
            <Card.Image style={{height: 'auto'}} src={resource.img} />
            <Card.Content>
              <Media>
                <Media.Item>
                  <Heading style={{color: '#77b749', textTransform: 'capitalize'}} size={5}>
                    <a href={resource.web_link} style={{color: '#77b749', textDecoration: 'none', fontFamily: 'Arial'}} target='_blank'>{resource.resource}</a>
                  </Heading>
                  <Heading subtitle style={{color: 'black', textTransform: 'capitalize', fontFamily: 'Arial'}} size={6}>
                    {resource.organization}
                  </Heading>
                </Media.Item>
              </Media>
              <div style={{textTransform: 'capitalize', fontSize: '0.8rem'}}>
                {breadcrumbs.map((b, i) => i > 0 ? <span key={b.key}> / {b.name}</span> : <span key={b.key}>{b.name}</span>)}
              </div>
            </Card.Content>
          </Card>
        </Columns.Column>
      )
    })
  }
  render() {
    const center = { textAlign: 'center', textTransform: 'unset' };
    return (
      <Hero size='fullheight'>
        <Hero.Head style={center} className="pageHeader" renderAs="header">
          <Heading className='is-spaced' style={{textAlign: 'center', marginTop: '1em', color: '#77b749', letterSpacing: 0, fontFamily: 'arial', textTransform: 'unset'}} size={3}>Agriculture Resource Database</Heading>
          <Heading style={center} subtitle>
            <span style={{fontSize: '18px', marginTop: '1em', letterSpacing: 0, fontFamily: 'arial'}}>
              Welcome to the Agriculture Resource Database. You can search by keyword, resource category or type of commodity.
            </span>
            <br />
            <span style={{fontSize: '18px', marginTop: '1em', letterSpacing: 0, fontFamily: 'arial'}}>
              Not finding what you’re looking for? Running into problems? Know of a resource that should be added? Please contact <span style={{color: 'rgb(119, 183, 73)'}}>lillooetagricultureandfood@gmail.com</span>.
            </span>
          </Heading>
        </Hero.Head>
        <Hero.Body>
          <Container>
            <Columns>
              {/* FILTERS */}
              <Columns.Column className='filters is-3 is-centered-tablet is-centered-mobile'>
                <Form.Control style={{marginBottom: '1em'}}>
                  <Form.Input className='searchBar' placeholder='search by keyword' value={this.state.searchInput} onChange={this.handleSearchInput}></Form.Input>
                </Form.Control>
                <Form.Control style={{marginBottom: '0.5em'}}>
                  <Heading className='category-heading'>Category</Heading>
                </Form.Control>
                {this.state.categories.filter(c => c).map((c, i) => (
                  <Form.Control fullwidth size='medium' key={i} style={{textTransform: 'capitalize'}}>
                    <Form.Checkbox className='category-checkbox' name={c} onClick={this.toggleCategory}>{c}</Form.Checkbox>
                  </Form.Control>))}
                {/* <hr /> */}
                <Form.Control style={{marginTop: '1em', marginBottom: '0.5em'}}>
                  <Heading className='commodity-heading'>Commodity</Heading>
                </Form.Control>
                {this.state.commodities.map((c, i) => (
                  <Form.Control fullwidth size='medium' key={i} style={{textTransform: 'capitalize'}}>
                    <Form.Checkbox name={c} onClick={this.toggleCommodity}>{c}</Form.Checkbox>
                  </Form.Control>))}
              </Columns.Column>
              {/* Resources */}
              <Columns.Column>
                <img onClick={this.returnToTop} className='toTop toTopIcon' alt='return to top icon' src='/up.svg' />
                <Columns>
                  {this.renderResources()}
                </Columns>
              </Columns.Column>
          </Columns>
        </Container>
        </Hero.Body>
        <Modal onClose={this.toggleAddResource} show={this.state.show}>
          <Modal.Content style={{minWidth: '80vw'}}>
            <Section style={{ backgroundColor: 'white' }}>
              <Field kind='group'>
                <Control fullwidth={true} multiline={true} horizontal={true}>
                  <Label>Resource Name</Label>
                  <Input />
                </Control>
                <Control fullwidth={true} >
                  <Label>Organization</Label>
                  <Input />
                </Control>
              </Field>
              <Field>
                <Label>Key words</Label>
                <Control>
                  <Input placeholder='Separate with commas' />
                </Control>
              </Field>
              <Field>
                <Label>Resource Link</Label>
                <Control>
                  <Input type='text' />
                </Control>
              </Field>
              <Field>
                <Label>Image URL</Label>
                <Control>
                  <Input />
                </Control>
                <Help>Locate your image online, right click + copy image location, then paste here</Help>
              </Field>
              <Field kind='group' multiline={true}>
                <Control>
                  <Label>Category</Label>
                  <SelectControlled>
                    <option key='option1' disabled={true} selected={true}>Select category</option>
                    {this.state.categories.map((c, index) => (<option value={c} key={index} style={{textTransform: 'capitalize'}}>{c}</option>))}
                  </SelectControlled>
                </Control>
                <Control>
                  <Label>Subcategory</Label>
                  <SelectControlled>
                    <option key='option2' disabled={true} selected={true}>Select subcategory</option>
                    {this.state.subcategories.map((c, index) => (<option value={c} key={index} style={{textTransform: 'capitalize'}}>{c}</option>))}
                  </SelectControlled>
                </Control>
                <Control>
                  <Label>Commodity</Label>
                  <SelectControlled>
                    <option key='option3' disabled={true} selected={true}>Select commodity</option>
                    {this.state.commodities.map((c, index) => (<option value={c} key={index} style={{textTransform: 'capitalize'}}>{c}</option>))}
                  </SelectControlled>
                </Control>
              </Field>
              <Field kind='group'>
                <Control>
                  <Button color='danger'>Cancel</Button>
                </Control>
                <Control align='right'>
                  <Button color='info' type='submit'>Submit</Button>
                </Control>
              </Field>
            </Section>
          </Modal.Content>
        </Modal>
      </Hero>
    );
  }
}

export default App;
