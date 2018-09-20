import React, { Component } from 'react';
import './App.css';
import { Columns, Hero, Card, Media, Modal, Section, Navbar, Heading, Form, Button, Container } from 'react-bulma-components/full';
import { Field, Control, Label, Input, Select, Help } from 'react-bulma-components/lib/components/form';
const data = require("./data.json");
let imgLink = `https://www.lillooetagricultureandfood.org/wp-content/uploads/2018/09`
const defaultImgs = {
  'production': `${imgLink}/production.jpg`,
  'important-contacts': `${imgLink}/important-contacts.jpg`,
  'plans-regulations': `${imgLink}/plans-and-regulations-.jpeg`,
  'education-learning': `${imgLink}/education-and-learning.jpg`,
  'sales-distribution': `${imgLink}/sales-and-distribution.jpg`,
  'funding': `${imgLink}/funding.jpg`,
  'finances': `${imgLink}/finances.jpg`,
  'operations': `${imgLink}/operations.jpg`,
  'marketing': `${imgLink}/marketing.jpg`,
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
      (category.length && commodity.length && category.every(c => cats.includes(c)) && commodity.every(c => resource.commodity === c)) ||
        // second option: we have no category and a commodity
      (!category.length && commodity.length && commodity.every(c => resource.commodity === c)) ||
        // third option: we have no commodity and a category
      (!commodity.length && category.length && category.every(c => cats.includes(c)))
      // (this.state.searchInput.length && resource.keys.split(',').map(t => t.trim()).some(k => k.toLowerCase().includes(this.state.searchInput)))
    )
  })
  handleSearchInput = (e) => {
    this.setState({searchInput: e.target.value})
  }
  toggleCategory = (e) => this.setState({ category: e.target.checked ? this.state.category.concat([e.target.name]) : this.state.category.filter(v => v !== e.target.name) })
  toggleCommodity = (e) => this.setState({ commodity: e.target.checked ? this.state.commodity.concat([e.target.name]) : this.state.commodity.filter(v => v !== e.target.name) })
  toggleAddResource = (e) => this.setState({show: !this.state.show})
  componentWillMount () {
    let db = data.map(d => Object.assign({}, d, {
      terms: d.keys.split(',').concat([d.organization, d.category, d.web_link, d.subcategory]).map(t => t.trim().toLowerCase()),
      category: d.category.toLowerCase().trim(),
      subcategory: d.subcategory.toLowerCase().trim(),
      commodity: d.commodity.toLowerCase().trim(),
      img: d.img || defaultImgs[d.category.toLowerCase().trim().replace(' & ', '-').replace(' ', '-')]
    }))
    console.log(new Set(db.map(d => d.img)))
    this.setState({
      categories: Array.from(new Set(data.map(resource => resource.category.toLowerCase().trim()).concat(data.map(resource => resource.subcategory.toLowerCase().trim())))),
      subcategories: Array.from(new Set(data.map(resource => resource.subcategory.toLowerCase().trim()))),
      commodities: Array.from(new Set(data.filter(d => d.commodity !== 'All').map(resource => resource.commodity.toLowerCase().trim()))),
      resources: db
    })
  }

  renderResources = () => {
    return this.state.category.length > 2 || this.state.commodity.length > 1 ? <h3>No matches possible, relax your sphincter!</h3> :
    this.applyFilters(this.state.resources).map((resource, index) => {
      let breadcrumbs = resource.category !== resource.subcategory ? [{name: resource.category, url: 'some-link', key : index}, {name: resource.subcategory, url: '', key : index + '1'}] : [{name: resource.category, url: 'some-link', key : index}]
      return (
        <Columns.Column size={4} key={resource.web_link + '_' + index}>
          <Card>
            <Card.Image size="4by3" src={resource.img} />
            <Card.Content>
              <Media>
                <Media.Item>
                  <Heading style={{color: 'black', textTransform: 'capitalize'}} size={4}>
                    <a href={resource.web_link} target='_blank'>{resource.resource}</a>
                  </Heading>
                  <Heading subtitle style={{color: 'black', textTransform: 'capitalize'}} size={6}>
                    {resource.organization}
                  </Heading>
                </Media.Item>
              </Media>
              <div style={{textTransform: 'capitalize'}}>
                {breadcrumbs.map((b, i) => i > 0 ? <span key={b.key}> / {b.name}</span> : <span key={b.key}>{b.name}</span>)}
              </div>
              {/* <Breadcrumb style={{marginBottom: '-1em', textTransform: 'capitalize'}} items={breadcrumbs} /> */}
              {/* <Content>
                <br />
                {resource.keys.split(',').map((t, i) => {let tag = t.trim(); return (
                  <Tag key={`${i}${Math.random()}`}>
                    {tag}
                  </Tag>
                )})}
                <br/>
              </Content> */}
            </Card.Content>
          </Card>
        </Columns.Column>
      )
    })
  }
  render() {
    return (
      <Hero size="fullheight">
        {/* <Hero.Head renderAs="header">
          <Navbar fixed='top' color='white'>
            <Navbar.Brand>
          <Navbar.Item href="#" renderAs='header'>
          Farmer Resource Database
          </Navbar.Item>
            </Navbar.Brand>
            <Navbar.Menu style={{justifyContent: 'end'}}>
          <Navbar.Item className='addResourceButton' href="#" renderAs='div'>
          <Button onClick={this.toggleAddResource}>New Resource</Button>
          </Navbar.Item>
            </Navbar.Menu>
          </Navbar>
        </Hero.Head> */}
        <Hero.Body>
          <Container>
            <Columns>
              <Columns.Column className='filters is-narrow is-centered-tablet is-centered-mobile'>
                <Form.Control style={{marginBottom: '1em'}}>
                  <Form.Input className='searchBar' placeholder="search anything" value={this.state.searchInput} onChange={this.handleSearchInput}></Form.Input>
                </Form.Control>
                <Form.Control style={{marginBottom: '0.5em'}}><Heading>Category</Heading></Form.Control>
                {this.state.categories.filter(c => c).map((c, i) => (
                  <Form.Control fullwidth size='medium' key={i} style={{textTransform: 'capitalize'}}>
                    <Form.Checkbox name={c} onClick={this.toggleCategory}>{c}</Form.Checkbox>
                  </Form.Control>))}
                {/* <hr /> */}
                <Form.Control style={{marginTop: '1em', marginBottom: '0.5em'}}><Heading>Commodity</Heading></Form.Control>
                {this.state.commodities.map((c, i) => (
                  <Form.Control fullwidth size='medium' key={i} style={{textTransform: 'capitalize'}}>
                    <Form.Checkbox name={c} onClick={this.toggleCommodity}>{c}</Form.Checkbox>
                  </Form.Control>))}
              </Columns.Column>
              <Columns.Column>
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
                  <Input placeholder="Separate with commas" />
                </Control>
              </Field>
              <Field>
                <Label>Resource Link</Label>
                <Control>
                  <Input type="text" />
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
                    {this.state.categories.map(c => (<option value={c} style={{textTransform: 'capitalize'}}>{c}</option>))}
                  </SelectControlled>
                </Control>
                <Control>
                  <Label>Subcategory</Label>
                  <SelectControlled>
                    <option key='option2' disabled={true} selected={true}>Select subcategory</option>
                    {this.state.subcategories.map(c => (<option value={c} style={{textTransform: 'capitalize'}}>{c}</option>))}
                  </SelectControlled>
                </Control>
                <Control>
                  <Label>Commodity</Label>
                  <SelectControlled>
                    <option key='option3' disabled={true} selected={true}>Select commodity</option>
                    {this.state.commodities.map(c => (<option value={c} style={{textTransform: 'capitalize'}}>{c}</option>))}
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
